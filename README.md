# casesnow-app

mobile app for service providers to document the work they did

## Development

    git clone <repo> && cd <repo>
    nvm use
    npm i
    expo start

Branch off master with relevant topic name, open pull request, increment build number in app.json when you're ready to merge.

Use expo release channels for testing. Each published build has a release channel. the default being "default" which goes to the production app OTA (don't publish to that unless you're ready to go live). Until then, use names release channels and give links to users. Use this method:

    $ expo publish --release-channel 1.0.1.6
    [23:07:46] Publishing to channel '1.0.1.6'...
    [23:07:50] Building iOS bundle
    [23:07:50] Building Android bundle
    [23:07:50] Analyzing assets
    [23:07:50] Uploading assets
    [23:07:53] No assets changed, skipped.
    [23:07:53] Processing asset bundle patterns:
    [23:07:53] - /Users/jsullivan/Code/casesnow/casesnow-app/**/*
    [23:07:53] Uploading JavaScript bundles
    [23:07:59] Published
    [23:07:59] Your URL is

    https://exp.host/@casesnow/casesnow?release-channel=1.0.1.6

## Release

OTA Updates:

    git checkout master -f
    git pull
    nvm use
    npm i
    expo login # casesnow
    expo p

App Builds: # follow above process first
expo build:ios
expo build:android

## Versions:

- 1.0.1.14
  - bugfixes found via sentry
  - fix slow "next" button in sync message when logging snow (show message earlier)
- 1.0.1.13
  - show user-friendly errors when submit fails
  - show last update time in logout dialog
  - send app update errors to sentry
- 1.0.1.12
  - force app version check when on list screen
  - fixed caching of the user's name (was remembering for too long)
  - more text when refreshing list about what is being done (version, location, user info, results)
  - use different field for special notes per jay
- 1.0.1.11
  - hide work order number until we populate it
  - don't give auth error message on first launch
  - prevent crash on android when submitting snow services
- 1.0.1.10
  - fix bug when launching app as new user and requiring logout
  - confirmation screen fixes for smaller screens (iphone8, android moto g4)
  - feedback to user when network is not available on list screen
  - fix for large font sizes on small androids: comment input
  - show version number of OTA updates
  - make snow submit screen scroll for long comments and small phones
  - convert date change screen to modal to make UI more simple
  - shorter date format in snow submit screen to stop wrapping on small phones or big fonts
  - make override date fields consistent (time didn't always update)
  - show special requirements text on map screen
- 1.0.1.9
  - enable submitting snow services
  - allow user to override date and keep it in a separate field so we know if they're overriding it
  - implement spinner when uploading data
  - make snow submit screen preview all the data being submitted
  - pull the service provider name into the app
  - center text on date change button in snow submit screen
  - refactoring code to make sync services more adaptable for other pages
  - fix box sizes when adding a 3rd service (ie. lawn)
  - make gps lock slightly less accurate and cache for 5 mins to speed up refreshes
  - don't make user wait for upgrade process to finish when loading list (speeds it up)
- 1.0.1.8
  - fix crash when canceling photo add
  - fix crash when searching for no text
- 1.0.1.7
  - differnet submit screen text to keep user on screen
  - show user number of photos being backed up
  - show image count on photo button
  - fix scenario where user can submit audit and still get back into audit and is stuck with error
  - take out offline messages (since cause more worry than help right now)
  - install sentry for error handling
  - show multiline error messages on android
- 1.0.1.6
  - remove links on address bar at top of inspection and site map screen since redundant
  - switch list to stateless component to make render faster
  - use local storage of locations when launching the app to make it feel faster
  - show offline message when user is offline
  - fix double photo upload when taking pictures rapidly
  - save to salesforce only the selected service, not all available services
  - record time when user starts and submits an inspection for reporting later
  - remove customer specific boilerplate text from services confirmation screen
  - resize images to max 1024 width and compress to 50% to speed upload
- 1.0.1.5
  - show version number in logout dialog
  - OTA update notifies user and blocks list view
  - stability fixes in audit screens
- 1.0.1.4
  - first release
