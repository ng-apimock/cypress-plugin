@select-preset
Feature: Select preset

  Developers must be able to:

  - Select a preset to set a preferred state
  - Create a preset with mocks and variables
  - Create a preset with mocks and without variables
  - Create a preset without mocks and with variables

  Background:
    Given ng-apimock has been initialized
    And the following presets are present:
      | name  | mocks | variables |
      | happy | 2     | 1         |
    And the following mocks state:
      | name              | scenario |
      | get repositories  | ok       |
      | create repository | ok       |
      | readme            | ok       |
    And the following variables state:
      | key | value |

  # When selecting a preset the following things will be tested:
  # - select scenario
  # - set variable
  Scenario: Select a preset
    Given I open the page
    When I select the preset happy
    Then the following mocks state:
      | name              | scenario     |
      | get repositories  | dummy        |
      | create repository | unauthorized |
    And the following variables state:
      | key               | value             |
      | dummy-description | dummy description |

  Scenario: Create a preset
    Given I open the page
    When I select the preset happy
    And I create a preset unhappy with mocks and variables
    Then the following presets are present:
      | name    | mocks | variables |
      | happy   | 2     | 1         |
      | unhappy | 3     | 1         |

  Scenario: Create a preset without mocks
    Given I open the page
    When I select the preset happy
    And I create a preset unhappy_without_mocks_with_variables without mocks and with variables
    Then the following presets are present:
      | name                                 | mocks | variables |
      | happy                                | 2     | 1         |
      | unhappy                              | 3     | 1         |
      | unhappy_without_mocks_with_variables | 0     | 1         |

  Scenario: Create a preset without variables
    Given I open the page
    When I select the preset happy
    When I create a preset unhappy_with_mocks_without_variables with mocks and without variables
    Then the following presets are present:
      | name                                 | mocks | variables |
      | happy                                | 2     | 1         |
      | unhappy                              | 3     | 1         |
      | unhappy_without_mocks_with_variables | 0     | 1         |
      | unhappy_with_mocks_without_variables | 3     | 0         |
