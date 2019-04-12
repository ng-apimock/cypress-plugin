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
      | name      | scenario          |
      | get items | crypto-currencies |
      | post item | ok                |
    And the following variables state:
      | key | value |

    # Verify after selecting a scenario

  Scenario: Add a variable and get the items (interpolated)
    Given I open the test page
    When I add variable coinName with value Cool
    And I get the items
    Then the response is interpolated with variable Cool
    And the following variables state:
      | key      | value |
      | coinName | Cool  |

  Scenario: Update a variable and get the items (interpolated)
    Given I open the test page
    When I add variable coinName with value Cool
    And I update variable coinName with value Super
    And I get the items
    Then the response is interpolated with variable Super
    And the following variables state:
      | key      | value |
      | coinName | Super |

  Scenario: Delete a variable and get the items (interpolated)
    Given I open the test page
    When I add variable coinName with value Cool
    And I delete variable coinName
    And I get the items
    Then the crypto-currencies response is returned for get items