"""
টালিখাতা Android App
WebView wrapper that loads the web app.
The Django backend is bundled and started locally.
"""
import os
import threading
import time

# Try to start Django server in background thread
SERVER_PORT = 8765

def start_django_server():
    """Start Django's dev server on a background thread."""
    import sys
    # Make sure we can find the backend
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    if os.path.exists(backend_path):
        sys.path.insert(0, backend_path)
        os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
        os.environ['SERVER_PORT'] = str(SERVER_PORT)
        try:
            import django
            django.setup()
            from django.core.management import call_command
            call_command('runserver', f'127.0.0.1:{SERVER_PORT}', '--noreload')
        except Exception as e:
            print(f"Django server error: {e}")


# Android WebView App using Kivy + pyjnius
from kivy.app import App
from kivy.uix.floatlayout import FloatLayout
from kivy.clock import Clock

try:
    from android.runnable import run_on_ui_thread
    from jnius import autoclass

    WebView      = autoclass('android.webkit.WebView')
    WebViewClient = autoclass('android.webkit.WebViewClient')
    activity     = autoclass('org.kivy.android.PythonActivity').mActivity
    ANDROID = True
except ImportError:
    ANDROID = False


class TaliKhataApp(App):
    webview = None

    def build(self):
        self.layout = FloatLayout()
        if ANDROID:
            Clock.schedule_once(lambda dt: self._init_webview(), 0.5)
        return self.layout

    @run_on_ui_thread
    def _init_webview(self):
        wv = WebView(activity)
        settings = wv.getSettings()
        settings.setJavaScriptEnabled(True)
        settings.setDomStorageEnabled(True)
        wv.setWebViewClient(WebViewClient())
        # Load Vite dev server URL
        wv.loadUrl('http://192.168.0.171:5173')
        activity.setContentView(wv)
        self.webview = wv


if __name__ == '__main__':
    TaliKhataApp().run()
