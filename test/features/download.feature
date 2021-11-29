@binary
Feature: Download files

  Developers must be able to:

  - download files

  Background:
    Given ng-apimock has been initialized
    And the following mocks state:
      | name              | scenario |
      | get repositories  | ok       |
      | create repository | ok       |
      | readme            | ok       |

  Scenario: Download binary
    Given I open the page
    When I download the readme for the repository core
    Then the README is downloaded
