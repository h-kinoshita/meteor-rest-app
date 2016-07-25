import { Restivus } from 'meteor/nimble:restivus';
import Bookmarks from './bookmarks/bookmarks';

export const Api = new Restivus({
  prettyJson: true,
});

Api.addRoute('hello', {
  get: {
    action: function() {
      return {
        status: 'success',
        data: {
          message: 'Hello, My First API!',
        },
      };
    },
  },
});
Api.addRoute('bookmarks', {
  get: {
    action: function() {
      return {
        status: 'success',
        data: Bookmarks.find().fetch(),
      };
    },
  },
  post: {
    action: function() {
      const { url, title } = this.bodyParams;
      const bookmark = {
        url,
        title,
        createdAt: new Date(),
      };
      const res = Bookmarks.insert(bookmark);
      return {
        status: 'success',
        data: Bookmarks.findOne(res),
      };
    },
  },
});
Api.addRoute('bookmarks/:id', {
  get: {
    action: function() {
      const bookmarkId = this.urlParams.id;
      return {
        status: 'success',
        data: Bookmarks.findOne(bookmarkId),
      };
    },
  },
  put: {
    action: function() {
      const bookmarkId = this.urlParams.id;
      const { url, title } = this.bodyParams;
      Bookmarks.update(bookmarkId, { $set: { url, title }});
      return {
        status: 'success',
        data: Bookmarks.findOne(bookmarkId),
      };
    },
  },
});

export default Api;
