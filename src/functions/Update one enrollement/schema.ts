export default {
    type: "object",
    properties: {
      courseid: { type: 'string' },
      studentid: { type: 'string' },
      dateofassigment: { type: 'string' }
    },
    required: ['courseid']
  } as const;
  