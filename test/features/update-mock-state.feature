@update-mock-state
Feature: Update mock state

  Developers must be able to:

  - Update mock state
  - select scenario
  - echo request
  - delay response

  in order to run the application against mocks.

  Background:
    Given ng-apimock has been initialized
    And the following mocks state:
      | name              | scenario |
      | get repositories  | ok       |
      | create repository | ok       |
      | readme            | ok       |

  # When selecting a scenario the following things will be tested:
  # - select scenario
  Scenario: Select scenario
    Given I open the page
    When I select scenario ok-added for mock get repositories
    And I refresh
    Then the following repositories are shown:
      | name                |
      | core                |
      | dev-interface       |
      | cypress-plugin      |
      | some-awesome-plugin |

  # When selecting a scenario the following things will be tested:
  # - delay response
  Scenario: Delay the response
    Given I open the page
    When I set delay to 2000 for mock get repositories
    And I refresh
    Then the repositories are not yet fetched
    When I wait a 2000 milliseconds
    Then the repositories are fetched
