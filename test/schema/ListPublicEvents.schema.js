const listPublicEventsSchema = {
  type: 'object',
  required: ['status', 'body'],
  properties: {
    status: { type: 'number' },
    body: {
      type: 'array',
      properties: {
        id: { type: 'number' },
        type: { type: 'string' },
        actor: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            login: { type: 'string' },
            isplay_login: { type: 'string' },
            gravatar_id: { type: 'string' },
            url: { type: 'string' },
            avatar_url: { type: 'string' }
          }
        },
        repo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            url: { type: 'string' }
          },
          required: ['id', 'name', 'url']
        },
        payload: {
          type: 'object',
          properties: {
            push_id: { type: 'number' },
            size: { type: 'number' },
            distinct_size: { type: 'number' },
            ref: { type: ['null', 'string'] },
            head: { type: 'string' },
            before: { type: 'string' },
            commits: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sha: { type: 'string' },
                  message: { type: 'string' },
                  distinct: { type: 'boolean' },
                  url: { type: 'string' },
                  author: {
                    type: 'object',
                    properties: {
                      email: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        public: { type: 'boolean' },
        created_at: { type: 'string' }
      }
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
