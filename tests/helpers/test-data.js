module.exports = [
  {
    email: 'me@me.com',
    password: 'abc',
    roles: {}
  },
  {
    email: 'roles@example.com',
    password: 'password',
    roles: { admin: 1, manager: 1, peon: 1 }
  },
    {
    email: 'nopassword@example.com',
    password: '',
    roles: { admin: 0, manager: 1, peon: 0 }
  },
  {
    email: 'gooduser@example.com',
    password: 'goodpassword',
    roles: { admin: 1, manager: 0, peon: 1 }
  }
];
