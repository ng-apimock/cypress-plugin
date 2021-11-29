@update-variables-state
Feature: Update variables state

  Developers must be able to:

  - Update variable state
  - add a variable
  - update a variable
  - delete a variable

  in order to run the application against mocks.

  Background:
    Given ng-apimock has been initialized
    Given the following mocks state:
      | name              | scenario |
      | get repositories  | ok       |
      | create repository | ok       |
      | readme            | ok       |
    And the following variables state:
      | key | value |

  # When adding a variable the following things will be tested:
  # - add variable
  # - interpolate data
  Scenario: Add a variable -> (interpolated normal response)
    Given I open the page
    When I select scenario dummy for mock get repositories
    And I refresh
    Then the following repositories are shown:
      | name  | description           |
      | dummy | %%dummy-description%% |
    When I add variable dummy-description with value dummy module
    And I refresh
    Then the following repositories are shown:
      | name  | description  |
      | dummy | dummy module |
    And the following variables state:
      | key               | value        |
      | dummy-description | dummy module |

  # When adding a variable the following things will be tested:
  # - add variable
  # - interpolate binary data
  Scenario: Add a variable -> (interpolated binary response)
    Given I open the page
    Then the following repositories are shown:
      | name | description          |
      | core | %%core-description%% |
    When I add variable core-description with value ng-apimock core module
    And I refresh
    Then the following repositories are shown:
      | name | description            |
      | core | ng-apimock core module |
    And the following variables state:
      | key              | value                  |
      | core-description | ng-apimock core module |

  # When updating a variable the following things will be tested:
  # - add variable
  # - interpolate
  Scenario: Update a variable -> (interpolated response)
    Given I open the page
    When I add variable core-description with value ng-apimock core module
    And I refresh
    Then the following repositories are shown:
      | name | description            |
      | core | ng-apimock core module |
    And the following variables state:
      | key              | value                  |
      | core-description | ng-apimock core module |
    When I update variable core-description with value updated ng-apimock core module
    And I refresh
    Then the following repositories are shown:
      | name | description                    |
      | core | updated ng-apimock core module |
    And the following variables state:
      | key              | value                          |
      | core-description | updated ng-apimock core module |

  # When deleting a variable the following things will be tested:
  # - delete variable
  # - interpolate
  Scenario: Delete a variable and get the items (interpolated)
    Given I open the page
    When I add variable core-description with value ng-apimock core module
    And I refresh
    Then the following repositories are shown:
      | name | description            |
      | core | ng-apimock core module |
    When I delete variable core-description
    And I refresh
    Then the following repositories are shown:
      | name | description          |
      | core | %%core-description%% |
