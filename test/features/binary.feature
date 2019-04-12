@binary
Feature: Binary data

  Developers must be able to:

  - download files

  Background:
    Given ng-apimock has been initialized
    Given the following mocks state:
      | name      | scenario          |
      | get items | crypto-currencies |
      | post item | ok                |

   # Verify after resetting the mock state to default

  Scenario: Download the binary
    Given I open the test page
    When I select scenario binary for mock get items
    And I download the binary file
    Then the binary response is downloaded