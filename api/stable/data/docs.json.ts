// import { WritableObjectDeep } from "type-fest/source/writable-deep"

import { Simplify } from "type-fest"

const APIDocs = {
  "openapi": "3.0.0",
  "paths": {
    "/menus-integration/menu/{posName}": {
      "get": {
        "operationId": "MenusIntegrationController_getMenu",
        "parameters": [
          {
            "name": "posName",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": ""
          }
        }
      }
    },
    "/menus-integration/webhook/{posName}": {
      "post": {
        "operationId": "MenusIntegrationController_postMenu",
        "parameters": [
          {
            "name": "posName",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/menus-integration/initialize-menus/{locationId}": {
      "post": {
        "operationId": "MenusIntegrationController_initializeMenus",
        "parameters": [
          {
            "name": "locationId",
            "required": true,
            "in": "path",
            "description": "The ID of the location to initialize the menus for",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "description": "The configuration of the POS provider",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreatePosProviderDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PosProvider"
                }
              }
            }
          }
        },
        "tags": [
          "Menus Integration"
        ]
      }
    },
    "/menu/assign-design": {
      "post": {
        "operationId": "MenuAppController_assignDesign",
        "summary": "Create a new MenuApp",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateMenuAppDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuApp"
                }
              }
            }
          }
        },
        "tags": [
          "MenuApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/menu/location/{locationId}": {
      "get": {
        "operationId": "MenuAppController_findMenuAppsByLocation",
        "summary": "Get MenuApps from a location",
        "parameters": [
          {
            "name": "locationId",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/MenuApp"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "MenuApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/menu/{id}": {
      "get": {
        "operationId": "MenuAppController_findOne",
        "summary": "Get a MenuApp by id",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuApp"
                }
              }
            }
          }
        },
        "tags": [
          "MenuApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/menu/connected": {
      "get": {
        "operationId": "MenuAppController_getConnectedMenuApps",
        "summary": "Get all connected MenuApps",
        "parameters": [
          {
            "name": "companyId",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "locationId",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "MenuApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/integration/webhook/{posName}": {
      "post": {
        "operationId": "IntegrationController_Webhook",
        "parameters": [
          {
            "name": "posName",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/integration/releases/{target}/{current_version}": {
      "get": {
        "operationId": "IntegrationController_GetAppVersion",
        "parameters": [
          {
            "name": "current_version",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "target",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/integration/releases_prod/{target}/{current_version}": {
      "get": {
        "operationId": "IntegrationController_GetAppVersionn",
        "parameters": [
          {
            "name": "current_version",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "target",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/integration/holidayOil": {
      "post": {
        "operationId": "__OldIntegrationController_holidayOil",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/integration/tableneeds/menu/updates": {
      "post": {
        "operationId": "__OldIntegrationController_tnmenuupdates",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/integration/qu": {
      "post": {
        "operationId": "__OldIntegrationController_qu",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/integration/webhook": {
      "post": {
        "operationId": "__OldIntegrationController_PostWebhookCbsNorthStarPOS",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/integration/Square": {
      "post": {
        "operationId": "__OldIntegrationController_GetSquareOrderData",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/integration/auth/clover": {
      "get": {
        "operationId": "__OldIntegrationController_authCloverGet",
        "parameters": [],
        "responses": {
          "200": {
            "description": ""
          }
        }
      }
    },
    "/": {
      "get": {
        "operationId": "TestController_test",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/users/search": {
      "post": {
        "operationId": "UsersController_getUsers",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Get Users Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/GetUsersDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: check body"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/confirm": {
      "post": {
        "operationId": "UsersController_confirm",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Confirm Email Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ConfirmEmailDto"
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "Accepted"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/reset-password": {
      "post": {
        "operationId": "UsersController_resetPassword",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Reset Password Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ResetPasswordDto"
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "Accepted"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/forgot-password": {
      "post": {
        "operationId": "UsersController_forgotPassword",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Forgot Password Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ForgotPasswordDto"
              }
            }
          }
        },
        "responses": {
          "202": {
            "description": "Accepted"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/resend-confirmation-link": {
      "post": {
        "operationId": "UsersController_resendConfirmationLink",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          },
          "202": {
            "description": "Accepted"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/resend-invitation-link": {
      "post": {
        "operationId": "UsersController_ResendInvitation",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Invitation Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ResendInvitationDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": ""
          },
          "202": {
            "description": "Accepted"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users": {
      "delete": {
        "operationId": "UsersController_deleteUser",
        "summary": "",
        "deprecated": true,
        "parameters": [
          {
            "name": "email",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "User not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "post": {
        "operationId": "UsersController_createUser",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "User Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/createUserDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: You cannot create a user with a higher role than yours"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "patch": {
        "operationId": "UsersController_updateUser",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "User Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EditUserDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: User not found"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "get": {
        "operationId": "UsersController_getUser",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: User not found"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/change-password": {
      "post": {
        "operationId": "UsersController_changePassword",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Change Password Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChangePasswordDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/change-avatar": {
      "post": {
        "operationId": "UsersController_changeAvatar",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "avatar": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": ""
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/request-email-update": {
      "post": {
        "operationId": "UsersController_requestEmailUpdate",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChangeEmailDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "Same email, newEmail must be an email, newEmail should not be empty"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/confirm-email-update": {
      "post": {
        "operationId": "UsersController_updateEmail",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/changeEmailConfirmationDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "token must be a jwt string,token should not be empty,user not found,Emailconfirmation token expired"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/stream": {
      "get": {
        "operationId": "UsersController_getStreamMembers",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SafeUser"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/users/company-people": {
      "get": {
        "operationId": "UsersController_getUserCompany",
        "parameters": [
          {
            "name": "companyId",
            "required": false,
            "in": "query",
            "description": "If not provided, the company of the user will be used",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SafeUser"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/company": {
      "post": {
        "operationId": "CompanyController_createCompany",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Company Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCompanyDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized."
          },
          "403": {
            "description": "Forbidden."
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "get": {
        "operationId": "CompanyController_getCompanies",
        "parameters": [
          {
            "name": "name",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Company"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized."
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/company/{_id}": {
      "get": {
        "operationId": "CompanyController_getCompany",
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized."
          },
          "404": {
            "description": "Company not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "patch": {
        "operationId": "CompanyController_updateCompany",
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Update Company Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCompanyDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized."
          },
          "404": {
            "description": "Company not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "delete": {
        "operationId": "CompanyController_deleteCompany",
        "summary": "",
        "deprecated": true,
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized."
          },
          "403": {
            "description": "Forbidden."
          },
          "404": {
            "description": "Company not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/company/change-logo": {
      "post": {
        "operationId": "CompanyController_changeAvatar",
        "parameters": [
          {
            "name": "company_id",
            "required": false,
            "in": "path",
            "description": "If you are a company manager, you can change the logo of your company.If you are a stream manager, you can change the logo of any company.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "logo": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": ""
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/location": {
      "post": {
        "operationId": "LocationController_create",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Location Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateLocationDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Location"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Location"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request."
          },
          "401": {
            "description": "unauthorized"
          },
          "403": {
            "description": "Forbidden."
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "get": {
        "operationId": "LocationController_getLocations",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Location"
                  }
                }
              }
            }
          },
          "401": {
            "description": "unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/location/{_id}": {
      "post": {
        "operationId": "LocationController_update",
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Location Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateLocationDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Location"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Location"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request."
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden."
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "delete": {
        "operationId": "LocationController_delete",
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Location"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request."
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden."
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "get": {
        "operationId": "LocationController_getLocation",
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Location"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request."
          },
          "401": {
            "description": "unauthorized"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/auth/login": {
      "post": {
        "operationId": "AuthController_login",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "properties": {
                  "username": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "accessToken",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokenResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized."
          }
        }
      }
    },
    "/auth/profile": {
      "get": {
        "operationId": "AuthController_getProfile",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/auth/refresh-token": {
      "post": {
        "operationId": "AuthController_refreshToken",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Old access token",
          "content": {
            "application/json": {
              "schema": {
                "properties": {
                  "accessToken": {
                    "type": "string",
                  }
                },
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "refreshed access token",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokenResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid request, no token provided"
          },
          "401": {
            "description": "Unauthorized, invalid token"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/font": {
      "post": {
        "operationId": "FontController_addOrUpdate",
        "summary": "Upload or update a font file",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "The font has been successfully uploaded/updated.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Font"
                }
              }
            }
          }
        },
        "tags": [
          "font"
        ]
      },
      "get": {
        "operationId": "FontController_searchFont",
        "parameters": [
          {
            "name": "limit",
            "required": true,
            "in": "query",
            "schema": {
              "minimum": 1,
              "type": "number"
            }
          },
          {
            "name": "page",
            "required": true,
            "in": "query",
            "schema": {
              "minimum": 1,
              "type": "number"
            }
          },
          {
            "name": "name",
            "required": false,
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "companyId",
            "required": false,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Font"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "font"
        ]
      },
      "delete": {
        "operationId": "FontController_deleteFont",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "uniqueId",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Font"
                }
              }
            }
          }
        },
        "tags": [
          "font"
        ]
      }
    },
    "/font/{id}": {
      "get": {
        "operationId": "FontController_getFont",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "The font",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Font"
                }
              }
            }
          }
        },
        "tags": [
          "font"
        ]
      }
    },
    "/design": {
      "post": {
        "operationId": "DesignController_create",
        "parameters": [
          {
            "name": "companyId",
            "required": true,
            "in": "query",
            "description": "The ID of the company to which the design belongs",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "name[in]",
            "required": false,
            "in": "query",
            "description": "...",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateDesignDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Design"
                }
              }
            }
          }
        },
        "tags": [
          "Design"
        ]
      },
      "get": {
        "operationId": "DesignController_findAll",
        "parameters": [
          {
            "name": "companyId",
            "required": true,
            "in": "query",
            "description": "The ID of the company to which the design belongs",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "jsonOnly",
            "required": false,
            "in": "query",
            "description": "If set to true, returns only the JSON data of the design",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "imageOnly",
            "required": false,
            "in": "query",
            "description": "If set to true, returns only the Image data of the design",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Design"
                  }
                }
              }
            }
          }
        },
        "tags": [
          "Design"
        ]
      }
    },
    "/design/{id}": {
      "get": {
        "operationId": "DesignController_findOne",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "jsonOnly",
            "required": false,
            "in": "query",
            "description": "If set to true, returns only the JSON data of the design",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "imageOnly",
            "required": false,
            "in": "query",
            "description": "If set to true, returns only the Image data of the design",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Design"
                }
              }
            }
          }
        },
        "tags": [
          "Design"
        ]
      },
      "patch": {
        "operationId": "DesignController_update",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateDesignDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        },
        "tags": [
          "Design"
        ]
      },
      "delete": {
        "operationId": "DesignController_remove",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": ""
          }
        },
        "tags": [
          "Design"
        ]
      }
    },
    "/screens": {
      "post": {
        "operationId": "ScreensController_createScreen",
        "parameters": [],
        "requestBody": {
          "required": true,
          "description": "Screen Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateScreenDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Screen"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Screen"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "get": {
        "operationId": "ScreensController_getScreens",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Screen"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/screens/{appId}": {
      "delete": {
        "operationId": "ScreensController_deleteScreen",
        "parameters": [
          {
            "name": "appId",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Screen"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Screen not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "patch": {
        "operationId": "ScreensController_updateScreen",
        "parameters": [
          {
            "name": "appId",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "description": "Screen Dto",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateScreenDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Screen"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Screen not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/screens/{_id}": {
      "get": {
        "operationId": "ScreensController_getScreen",
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Screen"
                }
              }
            }
          },
          "404": {
            "description": "Screen not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/screens/location/{_id}": {
      "get": {
        "operationId": "ScreensController_getScreenByLocation",
        "parameters": [
          {
            "name": "_id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Screen"
                }
              }
            }
          },
          "404": {
            "description": "Screen not found"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/ocbapp": {
      "post": {
        "operationId": "OcbAppController_create",
        "summary": "Create or update an OCB app",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/CreateOrUpdateOcbAppDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OcbApp"
                }
              }
            }
          }
        },
        "tags": [
          "OcbApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/ocbapp/{appId}": {
      "get": {
        "operationId": "OcbAppController_getOcbApp",
        "summary": "Get OCB app by appId",
        "parameters": [
          {
            "name": "appId",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OcbApp"
                }
              }
            }
          }
        },
        "tags": [
          "OcbApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/ocbapp/location/{locationId}": {
      "get": {
        "operationId": "OcbAppController_getOcbAppsInLocation",
        "summary": "Get list of OCB apps in a location",
        "parameters": [
          {
            "name": "locationId",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array"
                }
              }
            }
          }
        },
        "tags": [
          "OcbApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/ocbapp/company/{companyId}": {
      "get": {
        "operationId": "OcbAppController_getOcbAppsInCompany",
        "summary": "Get list of OCB apps in a company",
        "parameters": [
          {
            "name": "companyId",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array"
                }
              }
            }
          }
        },
        "tags": [
          "OcbApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/ocbapp/online/{companyId}": {
      "get": {
        "operationId": "OcbAppController_getOcbAppsOnlineInCompany",
        "summary": "Get list of online OCB apps by company",
        "parameters": [
          {
            "name": "companyId",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array"
                }
              }
            }
          }
        },
        "tags": [
          "OcbApp"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },

    "/sftp-xml": {
      "post": {
        "operationId": "SftpXmlController_downloadAndConvertXMLToJson",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "$ref": "#/components/schemas/SftpConfigDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RssChannel"
                }
              }
            }
          },
          "201": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RssChannel"
                }
              }
            }
          }
        }
      }
    },
    "/user-company/deleteCompany/{companyId}": {
      "delete": {
        "operationId": "UserCompanyController_deleteCompany",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Company deleted",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: Company does not exist"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/user-company/deleteUsers": {
      "delete": {
        "operationId": "UserCompanyController_deleteUser",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserIds"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Users deleted",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: User does not exist"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/user-company/restoreCompany/{companyId}": {
      "post": {
        "operationId": "UserCompanyController_restoreCompany",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Company restored",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Company"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: Company does not exist"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/user-company/restoreUsers": {
      "post": {
        "operationId": "UserCompanyController_restoreUser",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserIds"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Users restored",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request: User does not exist"
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/ticket": {
      "post": {
        "operationId": "TicketController_createTicket",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TicketDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Ticket"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "patch": {
        "operationId": "TicketController_reviewTicket",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/reviewTicketDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Ticket"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "delete": {
        "operationId": "TicketController_deleteTicket",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/deleteTicketDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Ticket"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      },
      "get": {
        "operationId": "TicketController_getTickets",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Ticket"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/ticket/{ticketId}": {
      "get": {
        "operationId": "TicketController_getTicket",
        "parameters": [],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Ticket"
                }
              }
            }
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/menus-sheet/menus": {
      "get": {
        "operationId": "MenusSheetController_getMenus",
        "parameters": [],
        "responses": {
          "200": {
            "description": ""
          }
        }
      },
      "post": {
        "operationId": "MenusSheetController_getMenusPost",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/menus-sheet/menus/reset": {
      "post": {
        "operationId": "MenusSheetController_resetMenus",
        "parameters": [],
        "responses": {
          "201": {
            "description": ""
          }
        }
      }
    },
    "/stream-pos/{resturant}": {
      "post": {
        "operationId": "StreamPosController_create",
        "parameters": [
          {
            "name": "resturant",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateStreamMenuDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": ""
          }
        }
      },
      "get": {
        "operationId": "StreamPosController_findAll",
        "parameters": [
          {
            "name": "resturant",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/stream-pos/{resturant}/menu/{id}": {
      "get": {
        "operationId": "StreamPosController_findOne",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "resturant",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": ""
          }
        }
      },
      "patch": {
        "operationId": "StreamPosController_update",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "resturant",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateStreamMenuDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": ""
          }
        }
      },
      "delete": {
        "operationId": "StreamPosController_remove",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "resturant",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": ""
          }
        }
      }
    },
    "/logs": {
      "get": {
        "operationId": "LogsController_getLogs",
        "parameters": [
          {
            "name": "fromDate",
            "in": "query",
            "description": "Start date for filtering logs",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "toDate",
            "in": "query",
            "description": "End date for filtering logs",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "username",
            "in": "query",
            "description": "Username for filtering logs",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "action",
            "in": "query",
            "description": "Action for filtering logs",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "description": "Sort parameter",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortOrder",
            "in": "query",
            "description": "Sort order string",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "logs": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Log"
                      }
                    },
                    "totalLogsCount": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "logs",
                    "totalLogsCount"
                  ]
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized."
          }
        },
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/logs/{id}": {
      "get": {
        "operationId": "LogsController_getLog",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": ""
          }
        }
      }
    },
    "/pos-provider/{id}": {
      "delete": {
        "operationId": "POSProviderController_delete",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully deleted"
          }
        }
      }
    },
  },
  "info": {
    "title": "",
    "description": "",
    "version": "1.0.0",
    "contact": {}
  },
  "tags": [],
  "servers": [],
  "components": {
    "securitySchemes": {
      "bearer": {
        "type": "http",
        "scheme": "bearer"
      }
    },
    "schemas": {
      "ObjectId": {
        "type": "object",
        "properties": {}
      },
      "GetUsersDto": {
        "type": "object",
        "properties": {
          "role": {
            "type": "number",
            "enum": [
              1,
              2,
              3,
              4
            ]
          },
          "userIds": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ObjectId"
            }
          },
          "verified": {
            "type": "boolean"
          },
          "deleted": {
            "type": "boolean"
          },
          "skip": {
            "type": "number",
            "minimum": 0
          },
          "limit": {
            "type": "number",
            "minimum": 1
          }
        }
      },
      "Logo": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string"
          },
          "key": {
            "type": "string"
          }
        },
        "required": [
          "url",
          "key"
        ]
      },
      "CreatePosProviderDto": {
        "type": "object",
        "properties": {
          "posName": {
            "enum": [
              "Tableneeds",
              "Stream"
            ],
            "type": "string"
          },
          "clientId": {
            "type": "string"
          },
          "configJson": {
            "type": "string"
          }
        },
        "required": [
          "posName",
          "clientId"
        ]
      },
      "PosProvider": {
        "type": "object",
        "properties": {
          "_id": {
            "$ref": "#/components/schemas/ObjectId"
          },
          "posName": {
            "enum": [
              "Tableneeds",
              "Stream"
            ],
            "type": "string"
          },
          "clientId": {
            "type": "string"
          },
          "configJson": {
            "type": "string"
          }
        },
        "required": [
          "_id",
          "posName",
          "clientId"
        ]
      },
      "Location": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "pos": {
            "$ref": "#/components/schemas/PosProvider"
          }
        },
        "required": [
          "_id",
          "name",
          "pos"
        ]
      },
      "Avatar": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string"
          },
          "key": {
            "type": "string"
          }
        },
        "required": [
          "url",
          "key"
        ]
      },
      "User": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "role": {
            "enum": [
              1,
              2,
              3,
              4
            ],
            "type": "number"
          },
          "company": {
            "$ref": "#/components/schemas/Company"
          },
          "verified": {
            "type": "boolean"
          },
          "FPToken": {
            "type": "string"
          },
          "NUToken": {
            "type": "string"
          },
          "locations": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Location"
            }
          },
          "changeEmailToken": {
            "type": "string"
          },
          "deleted": {
            "type": "boolean"
          },
          "deletedAt": {
            "format": "date-time",
            "type": "string"
          },
          "avatar": {
            "$ref": "#/components/schemas/Avatar"
          }
        },
        "required": [
          "_id",
          "username",
          "password",
          "firstName",
          "lastName",
          "role",
          "company",
          "verified",
          "FPToken",
          "NUToken",
          "locations",
          "changeEmailToken",
          "deleted",
          "avatar"
        ]
      },
      "Company": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "logo": {
            "$ref": "#/components/schemas/Logo"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "owner": {
            "$ref": "#/components/schemas/User"
          },
          "storage": {
            "type": "number"
          },
          "locations": {
            "type": "array",
            "items": {
              "type": "object"
            }
          },
          "deleted": {
            "type": "boolean"
          },
          "status": {
            "enum": [
              1,
              2,
              3,
              4
            ],
            "type": "number"
          },
          "deletedAt": {
            "format": "date-time",
            "type": "string"
          }
        },
        "required": [
          "_id",
          "logo",
          "name",
          "email",
          "owner",
          "storage",
          "locations",
          "deleted"
        ]
      },
      "ConfirmEmailDto": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        },
        "required": [
          "token",
          "password"
        ]
      },
      "ResetPasswordDto": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        },
        "required": [
          "token",
          "password"
        ]
      },
      "ForgotPasswordDto": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          }
        },
        "required": [
          "email"
        ]
      },
      "createUserDto": {
        "type": "object",
        "properties": {
          "companyId": {
            "type": "string"
          },
          "username": {
            "type": "string"
          },
          "role": {
            "type": "number",
            "enum": [
              1,
              2,
              3,
              4
            ]
          },
          "firstName": {
            "type": "string",
            "minLength": 3
          },
          "lastName": {
            "type": "string",
            "minLength": 3
          },
          "location": {
            "type": "string"
          }
        },
        "required": [
          "companyId",
          "username",
          "role",
          "firstName",
          "lastName",
          "location"
        ]
      },
      "ChangePasswordDTO": {
        "type": "object",
        "properties": {
          "oldPassword": {
            "type": "string"
          },
          "newPassword": {
            "type": "string"
          }
        },
        "required": [
          "oldPassword",
          "newPassword"
        ]
      },
      "EditUserDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
          },
          "firstName": {
            "type": "string",
            "minLength": 3,
            "maxLength": 20
          },
          "lastName": {
            "type": "string",
            "minLength": 3,
            "maxLength": 20
          },
          "email": {
            "type": "string"
          }
        },
        "required": [
          "firstName",
          "lastName",
          "email"
        ]
      },
      "ChangeEmailDto": {
        "type": "object",
        "properties": {
          "newEmail": {
            "type": "string"
          }
        },
        "required": [
          "newEmail"
        ]
      },
      "changeEmailConfirmationDto": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          }
        },
        "required": [
          "token"
        ]
      },
      "ResendInvitationDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "username": {
            "type": "string"
          },
          "role": {
            "type": "number",
            "enum": [
              1,
              2,
              3,
              4
            ]
          },
          "companyId": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "username",
          "role",
          "companyId"
        ]
      },
      "SafeUser": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "role": {
            "enum": [
              1,
              2,
              3,
              4
            ],
            "type": "number"
          },
          "company": {
            "$ref": "#/components/schemas/Company"
          },
          "verified": {
            "type": "boolean"
          },
          "FPToken": {
            "type": "string"
          },
          "NUToken": {
            "type": "string"
          },
          "locations": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Location"
            }
          },
          "changeEmailToken": {
            "type": "string"
          },
          "deleted": {
            "type": "boolean"
          },
          "avatar": {
            "$ref": "#/components/schemas/Avatar"
          }
        },
        "required": [
          "_id",
          "username",
          "password",
          "firstName",
          "lastName",
          "role",
          "company",
          "verified",
          "FPToken",
          "NUToken",
          "locations",
          "changeEmailToken",
          "deleted",
          "avatar"
        ]
      },
      "CreateCompanyDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "storage": {
            "type": "number"
          },
          "locations": {
            "type": "array",
            "items": {
              "type": "object"
            }
          },
          "deleted": {
            "type": "boolean"
          }
        },
        "required": [
          "name",
          "email",
          "storage",
          "locations",
          "deleted"
        ]
      },
      "UpdateCompanyDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          }
        },
        "required": [
          "name"
        ]
      },
      "CreateLocationDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "companyId": {
            "type": "string"
          }
        },
        "required": [
          "name"
        ]
      },
      "TokenResponse": {
        "type": "object",
        "properties": {
          "accessToken": {
            "type": "string"
          }
        },
        "required": [
          "accessToken"
        ]
      },
      "CreateScreenDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "company": {
            "$ref": "#/components/schemas/ObjectId"
          },
          "settings": {
            "type": "object"
          },
          "location": {
            "type": "string"
          },
          "appId": {
            "type": "string"
          },
          "type": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "company",
          "settings",
          "location",
          "appId",
          "type",
        ]
      },
      "Screen": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "appId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "company": {
            "$ref": "#/components/schemas/Company"
          },
          "settings": {
            "type": "object"
          },
          "location": {
            "$ref": "#/components/schemas/Location"
          }
        },
        "required": [
          "_id",
          "appId",
          "name",
          "company",
          "settings",
          "location"
        ]
      },
      "UpdateScreenDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "company": {
            "type": "string"
          },
          "settings": {
            "type": "object"
          }
        },
        "required": [
          "name",
          "company",
          "settings"
        ]
      },
      "MenuApp": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "appId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "design": {
            "$ref": "#/components/schemas/Design"
          },
          "screen": {
            "$ref": "#/components/schemas/Screen"
          }
        },
        "required": [
          "_id",
          "appId",
          "name",
          "design",
          "screen"
        ]
      },
      "CreateMenuAppDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the application.",
            "example": "appId-123"
          },
          "designId": {
            "type": "string",
            "description": "Optional ObjectId for the location.",
            "example": "603d2149e3b1c72edc8f5d62"
          }
        },
        "required": [
          "id",
          "designId"
        ]
      },
      "UpdateMenuAppDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "design": {
            "type": "string"
          },
          "location": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "design",
          "location"
        ]
      },
      "CreateOrUpdateOcbAppDto": {
        "type": "object",
        "properties": {
          "screen": {
            "$ref": "#/components/schemas/ObjectId"
          },
          "appId": {
            "type": "string"
          },
          "appConfig": {
            "type": "object"
          },
          "orderScreen": {
            "type": "object"
          },
          "welcomeScreen": {
            "type": "object"
          },
          "_atLeastOneProperty": {
            "type": "object"
          }
        },
        "required": [
          "screen",
          "appId",
          "appConfig",
          "orderScreen",
          "welcomeScreen",
          "_atLeastOneProperty"
        ]
      },
      "OcbApp": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "appConfig": {
            "type": "object"
          },
          "orderScreen": {
            "type": "object"
          },
          "welcomeScreen": {
            "type": "object"
          },
          "screen": {
            "$ref": "#/components/schemas/Screen"
          }
        },
        "required": [
          "_id",
          "appConfig",
          "orderScreen",
          "welcomeScreen",
          "screen"
        ]
      },
      "SftpConfigDto": {
        "type": "object",
        "properties": {
          "host": {
            "type": "string"
          },
          "username": {
            "type": "string"
          },
          "port": {
            "type": "number"
          },
          "password": {
            "type": "string"
          },
          "filePath": {
            "type": "string"
          }
        },
        "required": [
          "host",
          "username",
          "port",
          "password",
          "filePath"
        ]
      },
      "RssChannelEntry": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "readOnly": true
          },
          "description": {
            "type": "string",
            "readOnly": true
          },
          "items": {
            "readOnly": true,
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "title",
          "description",
          "items"
        ]
      },
      "RssChannel": {
        "type": "object",
        "properties": {
          "generator": {
            "type": "string",
            "readOnly": true
          },
          "title": {
            "type": "string",
            "readOnly": true
          },
          "link": {
            "type": "string",
            "readOnly": true
          },
          "ttl": {
            "type": "string",
            "readOnly": true
          },
          "start=2023-07-19T06:00:00;end=2023-07-26T05:59:59;scheme=W3C-DTF": {
            "readOnly": true,
            "allOf": [
              {
                "$ref": "#/components/schemas/RssChannelEntry"
              }
            ]
          }
        },
        "required": [
          "generator",
          "title",
          "link",
          "ttl",
          "start=2023-07-19T06:00:00;end=2023-07-26T05:59:59;scheme=W3C-DTF"
        ]
      },
      "UserIds": {
        "type": "object",
        "properties": {
          "userIds": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ObjectId"
            }
          }
        }
      },
      "TicketDto": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string"
          },
          "goal": {
            "type": "number"
          }
        },
        "required": [
          "description",
          "goal"
        ]
      },
      "Ticket": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "company": {
            "$ref": "#/components/schemas/Company"
          },
          "createdBy": {
            "$ref": "#/components/schemas/User"
          },
          "reviewedBy": {
            "$ref": "#/components/schemas/User"
          },
          "description": {
            "type": "string"
          },
          "reviewed": {
            "type": "boolean"
          },
          "decision": {
            "enum": [
              1,
              2
            ],
            "type": "number"
          },
          "goal": {
            "enum": [
              1,
              2
            ],
            "type": "number"
          }
        },
        "required": [
          "_id",
          "company",
          "createdBy",
          "reviewedBy",
          "description",
          "reviewed",
          "decision",
          "goal"
        ]
      },
      "reviewTicketDto": {
        "type": "object",
        "properties": {
          "ticketId": {
            "$ref": "#/components/schemas/ObjectId"
          },
          "decision": {
            "type": "number",
            "enum": [
              1,
              2
            ]
          }
        },
        "required": [
          "ticketId",
          "decision"
        ]
      },
      "deleteTicketDto": {
        "type": "object",
        "properties": {
          "ticketId": {
            "type": "string"
          }
        },
        "required": [
          "ticketId"
        ]
      },
      "ModifierDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "price": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "price"
        ]
      },
      "ModifierGroupDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "modifiers": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ModifierDto"
            }
          }
        },
        "required": [
          "name",
          "modifiers"
        ]
      },
      "VariationDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "price": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "price"
        ]
      },
      "MenuItemDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "price": {
            "type": "string"
          },
          "modifier_groups": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ModifierGroupDto"
            }
          },
          "variations": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/VariationDto"
            }
          }
        },
        "required": [
          "name",
          "description",
          "price",
          "modifier_groups",
          "variations"
        ]
      },
      "CategoryDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "object"
          },
          "name": {
            "type": "string"
          },
          "menu_items": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/MenuItemDto"
            }
          }
        },
        "required": [
          "id",
          "name",
          "menu_items"
        ]
      },
      "CreateStreamMenuDto": {
        "type": "object",
        "properties": {
          "menuId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "published_at": {
            "type": "string"
          },
          "categories": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CategoryDto"
            }
          }
        },
        "required": [
          "menuId",
          "name",
          "published_at",
          "categories"
        ]
      },
      "UpdateStreamMenuDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "published_at": {
            "type": "string"
          },
          "categories": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CategoryDto"
            }
          }
        },
        "required": [
          "name",
          "published_at",
          "categories"
        ]
      },
      "Log": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "username": {
            "type": "string"
          },
          "action": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "oldData": {
            "type": "object",
            "nullable": true
          },
          "newData": {
            "type": "object",
            "nullable": true
          }
        },
        "required": [
          "_id",
          "username",
          "action",
          "description",
          "timestamp"
        ]
      },
      "Font": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "subFonts": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "url": {
                  "type": "object",
                  "properties": {
                    "url": { "type": "string" },
                    "key": { "type": "string" }
                  },
                  "required": ["url", "key"]
                },
                "fontSubfamily": { "type": "string" },
              },
              "required": ["url", "fontSubfamily"]
            }
          }
        },
        "required": [
          "_id",
          "name",
          "subFonts"
        ]
      },
      "Design": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "location": {
            "$ref": "#/components/schemas/Location"
          },
          "json": {
            "type": "string"
          },
          "imageUrl": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "companyId": {
            "type": "string"
          }
        },
        "required": [
          "_id",
          "location",
          "json",
          "imageUrl",
          "name",
          "companyId"
        ]
      },
      "UpdateDesignDto": {
        "type": "object",
        "properties": {
          "json": {
            "type": "string",
            "description": "Optional JSON string representing the updated design data",
            "example": "{\"layout\": \"flex\", \"components\": [{\"type\": \"text\", \"content\": \"Updated Content\"}]}"
          },
          "imageUrl": {
            "type": "string",
            "description": "Optional URL of the updated image associated with the design",
            "example": "https://example.com/updated-design-image.png"
          },
          "locationId": {
            "type": "string",
            "description": "Optional MongoDB ObjectId representing the updated location of the design",
            "example": "60d7b7d531a0c00d8c7b0dfc"
          },
          "name": {
            "type": "string",
            "description": "Optional updated name of the design",
            "example": "Updated Design Name"
          }
        }
      }
    }
  }
} as const


type WritableDeep<T> =
  T extends object ? WritableObjectDeep<T> :
  T extends readonly (infer ArrayType)[] ? WritableDeep<ArrayType>[] :
  T

type WritableObjectDeep<ObjectType extends object> = {
  -readonly [KeyType in keyof ObjectType]: Simplify<WritableDeep<ObjectType[KeyType]>>
};

type APIDocsType = Simplify<WritableDeep<typeof APIDocs>>
export default APIDocs as APIDocsType
