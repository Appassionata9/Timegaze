#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface AppDelegate : NSObject <NSApplicationDelegate, WKScriptMessageHandler>
@property(strong) NSWindow *window;
@property(strong) WKWebView *webView;
@property(strong) NSStatusItem *statusItem;
@property(assign) NSRect normalWindowFrame;
@property(assign) BOOL compactMode;
@property(copy) NSString *interfaceLanguage;
@property(copy) NSString *statusTooltip;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification {
    NSRect frame = NSMakeRect(0, 0, 1120, 800);
    NSWindowStyleMask style = NSWindowStyleMaskTitled |
                              NSWindowStyleMaskClosable |
                              NSWindowStyleMaskMiniaturizable |
                              NSWindowStyleMaskResizable;

    self.window = [[NSWindow alloc] initWithContentRect:frame
                                              styleMask:style
                                                backing:NSBackingStoreBuffered
                                                  defer:NO];
    self.window.title = @"观时 · Timegaze";
    self.window.minSize = NSMakeSize(900, 680);
    self.window.titlebarAppearsTransparent = YES;
    self.window.backgroundColor = [NSColor colorWithRed:245.0/255.0
                                                  green:241.0/255.0
                                                   blue:232.0/255.0
                                                  alpha:1.0];

    WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
    configuration.websiteDataStore = [WKWebsiteDataStore defaultDataStore];
    [configuration.userContentController addScriptMessageHandler:self name:@"windowMode"];
    self.webView = [[WKWebView alloc] initWithFrame:frame configuration:configuration];
    self.webView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
    self.window.contentView = self.webView;

    NSURL *pageURL = [[NSBundle mainBundle] URLForResource:@"index"
                                             withExtension:@"html"
                                              subdirectory:@"app"];
    if (pageURL != nil) {
        [self.webView loadFileURL:pageURL
           allowingReadAccessToURL:[pageURL URLByDeletingLastPathComponent]];
    }

    self.interfaceLanguage = @"zh-CN";
    self.statusTooltip = @"观时 · Timegaze · 点击展开";
    [self installApplicationMenuForLanguage:self.interfaceLanguage appName:@"观时 · Timegaze"];
    [self.window center];
    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
}

- (void)userContentController:(WKUserContentController *)userContentController
      didReceiveScriptMessage:(WKScriptMessage *)message {
    if (![message.name isEqualToString:@"windowMode"] ||
        ![message.body isKindOfClass:[NSDictionary class]]) {
        return;
    }
    NSDictionary *payload = (NSDictionary *)message.body;
    NSNumber *compactValue = payload[@"compact"];
    NSNumber *alwaysOnTopValue = payload[@"alwaysOnTop"];
    NSNumber *timerActiveValue = payload[@"timerActive"];
    NSString *displayMode = payload[@"displayMode"];
    NSString *timeText = payload[@"timeText"];
    NSString *language = payload[@"language"];
    NSString *appName = payload[@"appName"];
    NSString *statusTooltip = payload[@"statusTooltip"];
    if (![compactValue isKindOfClass:[NSNumber class]]) {
        return;
    }
    BOOL alwaysOnTop = [alwaysOnTopValue isKindOfClass:[NSNumber class]] && alwaysOnTopValue.boolValue;
    BOOL timerActive = [timerActiveValue isKindOfClass:[NSNumber class]] && timerActiveValue.boolValue;
    BOOL usesMenuBar = [displayMode isKindOfClass:[NSString class]] && [displayMode isEqualToString:@"menuBar"];
    if ([language isKindOfClass:[NSString class]] &&
        ([language isEqualToString:@"zh-CN"] || [language isEqualToString:@"en"])) {
        BOOL languageChanged = ![self.interfaceLanguage isEqualToString:language];
        self.interfaceLanguage = language;
        if ([statusTooltip isKindOfClass:[NSString class]]) {
            self.statusTooltip = statusTooltip;
        }
        if ([appName isKindOfClass:[NSString class]]) {
            self.window.title = appName;
            if (languageChanged) {
                [self installApplicationMenuForLanguage:language appName:appName];
            }
        }
        if (self.statusItem != nil) {
            self.statusItem.button.toolTip = self.statusTooltip;
        }
    }

    if (timerActive && usesMenuBar) {
        [self showStatusItemWithText:[timeText isKindOfClass:[NSString class]] ? timeText : @""];
        self.window.level = NSNormalWindowLevel;
        if (compactValue.boolValue && self.window.isVisible) {
            self.normalWindowFrame = self.window.frame;
            [self.window orderOut:nil];
        }
        self.compactMode = NO;
        return;
    }

    [self removeStatusItem];
    [self applyCompactMode:compactValue.boolValue alwaysOnTop:alwaysOnTop];
    if (!timerActive && !self.window.isVisible) {
        if (!NSEqualRects(self.normalWindowFrame, NSZeroRect)) {
            [self.window setFrame:self.normalWindowFrame display:YES];
        }
        [self.window makeKeyAndOrderFront:nil];
        [NSApp activateIgnoringOtherApps:YES];
    }
}

- (void)showStatusItemWithText:(NSString *)timeText {
    if (self.statusItem == nil) {
        self.statusItem = [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
        self.statusItem.button.target = self;
        self.statusItem.button.action = @selector(showWindowFromStatusItem:);
        self.statusItem.button.toolTip = self.statusTooltip;
    }
    self.statusItem.button.title = timeText;
}

- (void)removeStatusItem {
    if (self.statusItem != nil) {
        [[NSStatusBar systemStatusBar] removeStatusItem:self.statusItem];
        self.statusItem = nil;
    }
}

- (void)showWindowFromStatusItem:(id)sender {
    if (!NSEqualRects(self.normalWindowFrame, NSZeroRect)) {
        [self.window setFrame:self.normalWindowFrame display:YES];
    }
    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
    [self.webView evaluateJavaScript:@"window.restoreFromMenuBar()" completionHandler:nil];
}

- (void)applyCompactMode:(BOOL)compact alwaysOnTop:(BOOL)alwaysOnTop {
    self.window.level = compact && alwaysOnTop ? NSFloatingWindowLevel : NSNormalWindowLevel;
    if (compact == self.compactMode) {
        return;
    }

    if (compact) {
        self.normalWindowFrame = self.window.frame;
        NSRect current = self.window.frame;
        NSSize compactSize = NSMakeSize(340, 190);
        NSRect compactFrame = NSMakeRect(
            NSMaxX(current) - compactSize.width,
            NSMaxY(current) - compactSize.height,
            compactSize.width,
            compactSize.height
        );
        self.window.minSize = NSMakeSize(320, 170);
        [self.window setFrame:compactFrame display:YES animate:YES];
    } else {
        self.window.minSize = NSMakeSize(900, 680);
        [self.window setFrame:self.normalWindowFrame display:YES animate:YES];
    }
    self.compactMode = compact;
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return self.statusItem == nil;
}

- (BOOL)applicationShouldHandleReopen:(NSApplication *)sender hasVisibleWindows:(BOOL)hasVisibleWindows {
    if (!hasVisibleWindows) {
        [self showWindowFromStatusItem:nil];
    }
    return YES;
}

- (void)installApplicationMenuForLanguage:(NSString *)language appName:(NSString *)appName {
    BOOL english = [language isEqualToString:@"en"];
    NSMenu *menuBar = [[NSMenu alloc] init];
    NSMenuItem *applicationItem = [[NSMenuItem alloc] init];
    [menuBar addItem:applicationItem];

    NSMenu *applicationMenu = [[NSMenu alloc] initWithTitle:appName];
    NSString *aboutTitle = english ? [NSString stringWithFormat:@"About %@", appName] : [NSString stringWithFormat:@"关于%@", appName];
    NSString *quitTitle = english ? [NSString stringWithFormat:@"Quit %@", appName] : [NSString stringWithFormat:@"退出%@", appName];
    NSMenuItem *aboutItem = [[NSMenuItem alloc] initWithTitle:aboutTitle
                                                       action:@selector(orderFrontStandardAboutPanel:)
                                                keyEquivalent:@""];
    [applicationMenu addItem:aboutItem];
    [applicationMenu addItem:[NSMenuItem separatorItem]];
    NSMenuItem *quitItem = [[NSMenuItem alloc] initWithTitle:quitTitle
                                                      action:@selector(terminate:)
                                               keyEquivalent:@"q"];
    [applicationMenu addItem:quitItem];
    applicationItem.submenu = applicationMenu;
    NSApp.mainMenu = menuBar;
}

@end

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        NSApplication *application = [NSApplication sharedApplication];
        application.activationPolicy = NSApplicationActivationPolicyRegular;
        AppDelegate *delegate = [[AppDelegate alloc] init];
        application.delegate = delegate;
        [application run];
    }
    return 0;
}
