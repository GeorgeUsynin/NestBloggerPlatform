
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getVercelVersion",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "App"
          ]
        }
      },
      "/users/{id}": {
        "get": {
          "operationId": "UsersController_getById",
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
                    "$ref": "#/components/schemas/UserViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Users"
          ]
        },
        "delete": {
          "operationId": "UsersController_deleteUser",
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
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Users"
          ]
        }
      },
      "/users": {
        "get": {
          "operationId": "UsersController_getAllUsers",
          "parameters": [
            {
              "name": "sortBy",
              "required": true,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "login",
                  "email"
                ]
              }
            },
            {
              "name": "searchLoginTerm",
              "required": true,
              "in": "query",
              "schema": {
                "nullable": true,
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "searchEmailTerm",
              "required": true,
              "in": "query",
              "schema": {
                "nullable": true,
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Users"
          ]
        },
        "post": {
          "operationId": "UsersController_createUser",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserInputDto"
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
                    "$ref": "#/components/schemas/UserViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Users"
          ]
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsController_getAllBlogs",
          "parameters": [
            {
              "name": "sortBy",
              "required": true,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "name"
                ]
              }
            },
            {
              "name": "searchNameTerm",
              "required": true,
              "in": "query",
              "schema": {
                "nullable": true,
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createBlog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateBlogInputDto"
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
                    "$ref": "#/components/schemas/BlogViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_getBlogById",
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
                    "$ref": "#/components/schemas/BlogViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        },
        "put": {
          "operationId": "BlogsController_updateBlogById",
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
                  "$ref": "#/components/schemas/UpdateBlogInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Blogs"
          ]
        },
        "delete": {
          "operationId": "BlogsController_deleteBlogById",
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
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogs/{id}/posts": {
        "get": {
          "operationId": "BlogsController_getAllPostsByBlogId",
          "parameters": [
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "sortBy",
              "required": true,
              "in": "query",
              "schema": {}
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
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
            "Blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createPostByBlogID",
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
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Blogs"
          ]
        }
      },
      "/posts": {
        "get": {
          "operationId": "PostsController_getAllPosts",
          "parameters": [
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "sortBy",
              "required": true,
              "in": "query",
              "schema": {}
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createPost",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostInputDto"
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
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{id}": {
        "get": {
          "operationId": "PostsController_getPostById",
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
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "put": {
          "operationId": "PostsController_updatePostById",
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
                  "$ref": "#/components/schemas/UpdatePostInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "delete": {
          "operationId": "PostsController_deletePostById",
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
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts/{id}/comments": {
        "get": {
          "operationId": "PostsController_getAllCommentsByPostId",
          "parameters": [
            {
              "name": "sortBy",
              "required": true,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt"
                ]
              }
            },
            {
              "name": "sortDirection",
              "required": true,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "pageNumber",
              "required": true,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": true,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
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
            "Posts"
          ]
        }
      },
      "/comments/{id}": {
        "get": {
          "operationId": "CommentsController_getCommentById",
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
                    "$ref": "#/components/schemas/CommentViewDto"
                  }
                }
              }
            }
          },
          "tags": [
            "Comments"
          ]
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_deleteAll",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Testing"
          ]
        }
      }
    },
    "info": {
      "title": "BLOGGER API",
      "description": "",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "UserViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "createdAt": {
              "type": "object"
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt"
          ]
        },
        "CreateUserInputDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string"
            },
            "password": {
              "type": "string"
            },
            "email": {
              "type": "string"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "BlogViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "type": "object"
            },
            "isMembership": {
              "type": "boolean"
            }
          },
          "required": [
            "id",
            "description",
            "name",
            "websiteUrl",
            "createdAt",
            "isMembership"
          ]
        },
        "CreateBlogInputDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            }
          },
          "required": [
            "description",
            "name",
            "websiteUrl"
          ]
        },
        "PostViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            },
            "createdAt": {
              "type": "object"
            },
            "extendedLikesInfo": {
              "type": "object",
              "properties": {
                "likesCount": {
                  "type": "number"
                },
                "dislikesCount": {
                  "type": "number"
                },
                "myStatus": {
                  "enum": [
                    "None",
                    "Like",
                    "Dislike"
                  ],
                  "type": "string"
                },
                "newestLikes": {
                  "type": "array",
                  "items": {
                    "type": "object"
                  }
                }
              },
              "required": [
                "likesCount",
                "dislikesCount",
                "myStatus",
                "newestLikes"
              ]
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo"
          ]
        },
        "UpdateBlogInputDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            }
          },
          "required": [
            "description",
            "name",
            "websiteUrl"
          ]
        },
        "CreatePostInputDto": {
          "type": "object",
          "properties": {
            "blogId": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "title": {
              "type": "string"
            }
          },
          "required": [
            "blogId",
            "content",
            "shortDescription",
            "title"
          ]
        },
        "UpdatePostInputDto": {
          "type": "object",
          "properties": {
            "blogId": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "title": {
              "type": "string"
            }
          },
          "required": [
            "blogId",
            "content",
            "shortDescription",
            "title"
          ]
        },
        "CommentViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "commentatorInfo": {
              "type": "object",
              "properties": {
                "userId": {
                  "type": "string"
                },
                "userLogin": {
                  "type": "string"
                }
              },
              "required": [
                "userId",
                "userLogin"
              ]
            },
            "createdAt": {
              "type": "object"
            },
            "likesInfo": {
              "type": "object",
              "properties": {
                "likesCount": {
                  "type": "number"
                },
                "dislikesCount": {
                  "type": "number"
                },
                "myStatus": {
                  "enum": [
                    "None",
                    "Like",
                    "Dislike"
                  ],
                  "type": "string"
                }
              },
              "required": [
                "likesCount",
                "dislikesCount",
                "myStatus"
              ]
            }
          },
          "required": [
            "id",
            "content",
            "commentatorInfo",
            "createdAt",
            "likesInfo"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
