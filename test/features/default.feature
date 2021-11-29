@default
Feature: Default responses

  - When an api call matches the mock request, the default response should be returned.

  Background:
    Given ng-apimock has been initialized
    And the following mocks state:
      | name              | scenario |
      | get repositories  | ok       |
      | create repository | ok       |
      | readme            | ok       |

  # When getting the repositories the following things will be tested:
  # - initializing of apimock
  # - http get support
  # - default response
  Scenario: Get request - shown in the repository overview
    Given I open the page
    Then the following repositories are shown:
      | name           |
      | core           |
      | dev-interface  |
      | cypress-plugin |
#
#  # When creating a repository the following things will be tested:
#  # - http post support
#  # - chaining
  Scenario: Post request - usecase: create repository
    Given I open the page
    When I try to create a repository
    Then the repository is added
