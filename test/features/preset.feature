@select-preset
Feature: Select preset

  Developers must be able to:

  - Select a preset to set a preferred state

  Background:
    Given ng-apimock has been initialized
    Given the following mocks state:
      | name      | scenario          |
      | get items | crypto-currencies |
      | post item | ok                |
    And the following variables state:
      | key | value |

    # Verify after selecting a preset

  Scenario: Select a preset
    Given I open the test page
    When I select the preset happy
    Then the following mocks state:
      | name      | scenario         |
      | get items | crypto-exchanges |
      | post item | nok              |
    And the following variables state:
      | key      | value   |
      | coinName | my coin |