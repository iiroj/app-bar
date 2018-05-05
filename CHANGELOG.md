# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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