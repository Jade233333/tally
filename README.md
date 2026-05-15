# Tally

> This script will unlikely be updated anymore.
> It was a nice small project done to get to know userscript and web dev,
> but the idea itself is not so useful.

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
    style: {
        fontSize: '72px',
    },
};
```

Limit is the threshold in seconds 
for the timer to turn completely solid(0.9 opacity)

Domains is the list of website that you want the timer to track.

The style is just `css` applied, so basically anything can be cusmoized
if one knows how to use `css`. 
Common properties that one may want to change include
`fontSize`, `fontFamily`, `color`.

## Todo
- night mode
- more customization.
    - ai-generated themes maybe?
- export data
    - it will be hard to implement
    - as right now GM storage is being used
    - only key value pair available and no direct file access
    - will not be easy to find a way to manage data over time cleanly
- interative approach for config
- complete block time limit
