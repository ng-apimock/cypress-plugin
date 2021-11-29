@actions
Feature: Actions

  Developers must be able to:

  - reset the mock state to defaults
  - set the mock state to passthroughs

  in order to run the application against mocks.

  Background:
    Given ng-apimock has been initialized
    And the following mocks state:
      | name              | scenario |
      | get repositories  | ok       |
      | create repository | ok       |
      | readme            | ok       |

  # When resetting the following things will be tested:
  # - initializing of apimock
  # - select scenario
  # - delay response
  # - reset to defaults
  Scenario: Reset mock state to defaults
    Given I open the page
    When I select scenario server-error for mock get repositories
    And I set delay to 2000 for mock get repositories
    When I refresh
    Then An error with message Internal Server Error has occured
    When I reset the mocks to default
    And I refresh
    Then the following repositories are shown:
      | name           |
      | core           |
      | dev-interface  |
      | cypress-plugin |

  # When setting to passThroughs the following things will be tested:
  # - initializing of apimock
  # - set to passThroughs
  Scenario: Set mocks to passThroughs
    Given I open the page
    When I set the mocks to passThroughs
    And I refresh
    Then the following repositories are shown:
      | name        |
      | base-client |
    And I try to create a repository
    Then An error with message Unauthorized has occured
