const resolvers = {
  User: {
    id(user) {
      return user._id;
    },

    library(user, args, { User }) {
      return user.library;
    },

    preferences(user, args, { User }) {
      return User.preferences(user);
    },
  },
  Query: {
    users(root, { lastCreatedAt, limit }, { User }) {
      return User.all({ lastCreatedAt, limit });
    },

    user(root, { id }, { User }) {
      return User.findOneById(id);
    },
  },
  Mutation: {
    async createUser(root, { input }, { User }) {
      const id = await User.insert(input);
      return User.findOneById(id);
    },

    async updateUser(root, { id, input }, { User }) {
      await User.updateById(id, input);
      return User.findOneById(id);
    },

    removeUser(root, { id }, { User }) {
      return User.removeById(id);
    },
  },
  Subscription: {
    userCreated: user => user,
    userUpdated: user => user,
    userRemoved: id => id,
  },
};

export default resolvers;
