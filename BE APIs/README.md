# Backend API Documentation

This folder contains JSON files documenting the API endpoints used by the TeamTasker frontend application. Each file represents a specific API endpoint or group of related endpoints.

## Structure

Each JSON file follows this structure:
```json
{
  "endpoint": "/api/resource",
  "description": "Description of the API endpoint",
  "methods": [
    {
      "method": "GET",
      "description": "Get resources",
      "url": "/api/resource",
      "queryParams": [
        {
          "name": "param1",
          "type": "string",
          "required": false,
          "description": "Filter by param1"
        }
      ],
      "request": {
        "headers": {
          "Authorization": "Bearer {token}"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "data": []
        }
      }
    }
  ]
}
```

## API Endpoints

The following API endpoints are documented:

1. **Tasks API** - Endpoints for managing tasks
2. **Users API** - Endpoints for user management and profiles
3. **Teams API** - Endpoints for team management and workload
4. **Activities API** - Endpoints for activity feeds and notifications
5. **Announcements API** - Endpoints for team announcements
6. **Skills API** - Endpoints for skills and development
7. **Authentication API** - Endpoints for authentication and authorization

## Base URL

All API endpoints are relative to the base URL:
```
http://localhost:3002/api
```

This can be configured in the frontend application through the `NEXT_PUBLIC_API_URL` environment variable.
