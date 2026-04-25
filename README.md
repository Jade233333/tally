# Tally

A userscript that tracks and displays time spent on configured websites. 
Shows a persistent timer overlay to help remind of your daily usage.
The opacity increases as more time spent on a configured website.

## Installation

Install it just like any other single file greasemonkey script. 
The particular process to use the script depends on different browser.
For Chrome-like browser one may want use the script manager `Tampermonkey`
And that is `Greasemonkey` on Firefox and `Userscripts` Safari.
Since the greasemonkey script is only a sinple file managed niche script,
the installation won't be hard.
Some managers even provide an interative way to install 
so one may simply copy the raw code and paste into.

If one happens to use a fancier browser like
[qutebrowser](https://github.com/qutebrowser/qutebrowser)
(really good project btw),
one has to find out how to install greasemonkey scripts on the browser's docs.
It might not even be a supported feature, very unlikey though.

## Usage

Currently, one has to modify the source code to config the script.
It may, but unlikely, provide interative way to config in the future,
as the project intends to be clean and straightfoward.

```js
const CONFIG = {
    limit: 1800,
    domains: [
        'youtube.com',
    ],
};
```

Limit is the threshold in seconds 
for the timer to turn completely solid(0.9 opacity)

Domains is the list of website that you want the timer to track.

## Todo
- more customization.
    - won't be too fancy as it intends to be lightweight and tidy
    - but will provide more basics including changing font
- export data
- interative way for config
