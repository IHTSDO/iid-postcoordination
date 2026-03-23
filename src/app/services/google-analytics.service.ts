import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, isDevMode } from '@angular/core';

declare global {
  interface Window {
    __GA_MEASUREMENT_ID__?: string;
    gtag?: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  trackPageView(pageTitle: string = 'Postcoordination workbench', pagePath: string = '/'): void {
    this.dispatchEvent('page_view', {
      page_title: pageTitle,
      page_path: pagePath
    });
  }

  trackEvent(eventName: string, eventParams: { [key: string]: any } = {}): void {
    this.dispatchEvent(eventName, eventParams);
  }

  trackConversion(action: string, category: string, label?: string, value?: number): void {
    this.dispatchEvent(action, {
      category,
      event_category: category,
      label,
      event_label: label,
      value
    });
  }

  private dispatchEvent(eventName: string, eventParams: { [key: string]: any }): void {
    const gtag = this.getGtag();
    if (!gtag || !this.shouldTrack()) {
      return;
    }

    const params = this.sanitizeParams(eventParams);
    if (this.isDebugEnabled()) {
      params['debug_mode'] = true;
    }

    gtag('event', eventName, params);
  }

  private shouldTrack(): boolean {
    if (this.isDebugEnabled()) {
      return true;
    }

    const hostname = this.document.location?.hostname ?? '';
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return false;
    }

    return !isDevMode();
  }

  private isDebugEnabled(): boolean {
    const search = this.document.location?.search ?? '';
    const params = new URLSearchParams(search);
    if (params.get('ga_debug') === '1') {
      return true;
    }

    try {
      return window.localStorage?.getItem('ga_debug') === '1';
    } catch {
      return false;
    }
  }

  private getGtag(): ((...args: any[]) => void) | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const measurementId = window.__GA_MEASUREMENT_ID__;
    if (!this.isValidMeasurementId(measurementId) || typeof window.gtag !== 'function') {
      return null;
    }

    return window.gtag;
  }

  private isValidMeasurementId(measurementId?: string): boolean {
    return typeof measurementId === 'string' && /^G-[A-Z0-9]+$/i.test(measurementId);
  }

  private sanitizeParams(eventParams: { [key: string]: any }): { [key: string]: any } {
    return Object.entries(eventParams).reduce((params, [key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value;
      }
      return params;
    }, {} as { [key: string]: any });
  }
}
