# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2018-07-31
### Changed
- Do not include sourcemaps
- Update packages
- Build with Typescript 3.0.1

## [1.6.0] - 2018-07-16
### Changed
- Do not write to dom styles directly
### Removed
- Remove redundant inline css `transition: top 100ms;`

## [1.5.0] - 2018-07-16
### changed
- Use new `React.createRef`
- Update packages
### Fixed
- Set component to `unfixed` when it has reached the top of the scrollable area
### Removed
- Remove redundant inline css `display: block; width: 100%;`

## [1.4.6] - 2018-07-02
### changed
- Update packages

## [1.4.6] - 2018-07-02
### changed
- Update packages

## [1.4.5] - 2018-06-24
### changed
- Update packages
- Move demo files to example/

## [1.4.4] - 2018-06-07
### Fixed
- Fix typo in license

## [1.4.3] - 2018-06-06
### Changed
- Updates to repository

## [1.4.2] - 2018-06-01
### Changed
- Update packages

## [1.4.1] - 2018-05-21
### Changed
- Update readme

## [1.4.0] - 2018-05-21
### Added
- Add three classes, `unfixed`, `hidden` and `pinned` to allow styling on the three absolute states.
  1. `unfixed` is applied when `<AppBar />` doesn't touch the top of the screen but is on the page
  2. `hidden` is applied when `<AppBar />` is fully hidden (for example, after scrolling down or reloading page when scrolled)
  3. `pinned` is applied when `<AppBar />` scrolling up from being hidden
### Changed
- The DOM element is now a `nav` instead of `div`

## [1.3.0] - 2018-05-05
### Removed
- Set styles the old way for SSR support (this leaves out Safari's `position: -webkit-sticky;` from the default styles).

## [1.2.0] - 2018-05-05
### Changed
- Styles are set via the dom node's `setAttribute` to allow for `position: -webkit-sticky;`
- Animation is run via `window.requestAnimationFrame`
- Animation function directly sets the `style.top`

## [1.1.3] - 2018-05-05
### Fixed
- Previous simplification made things worse, so revert it

## [1.1.2] - 2018-05-03
### Changed
- Simplify calculation of top value

## [1.1.1] - 2018-05-03
### Added
- Add `.travis.yml`

## [1.1.0] - 2018-05-03
### Changed
- Change position to `sticky` to support content above the `<AppBar />`

## [1.0.1] - 2018-05-02
### Fixed
- Fix incorrect equality operator when checking for changed `disabled` prop

## [1.0.0] - 2018-05-02
### Added
- Initial Release