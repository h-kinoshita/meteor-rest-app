import { Template } from 'meteor/templating';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './main.html';

import Bookmarks from '../imports/api/bookmarks/bookmarks';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';

Template.Bookmark.onCreated(function() {
  this.isEditMode = new ReactiveVar(false);
});

Template.Bookmarks.onCreated(function() {
  this.bookmarks = new ReactiveVar();
  const fetchBookmarks = () => {
    HTTP.get('/api/bookmarks', (err, res) => {
      if (err) { console.error(err); return; }
      this.bookmarks.set(res.data.data);
    });
  };
  fetchBookmarks()
  Meteor.setInterval(fetchBookmarks, 5000);
});

Template.BookmarkForm.events({
  'submit .bookmark-form'(event) {
    event.preventDefault();

    const url = event.target.url.value;
    const title = event.target.title.value;
    const callOptions = {data: {url, title}};

    HTTP.post('/api/bookmarks', callOptions, (err, res) => {
      if (err) { console.log(err); return; }
      event.target.url.value = "";
      event.target.title.value = "";
    });
  },
  'submit .bookmark-form.is-edit'(event, inst) {
    event.preventDefault();
    const _id = event.target._id.value;
    const url = event.target.url.value;
    const title = event.target.title.value;
    const callOptions = {data: {url, title}};

    HTTP.put(`/api/bookmarks/${_id}`, callOptions, (err, res) => {
      if (err) { console.log(err); return; }
      this.callbacks.onUpdate();
    });
  },
});

Template.Bookmark.events({
  'click .js-edit-bookmark'(event, inst) {
    event.preventDefault();
    inst.isEditMode.set(true);
  }
});

Template.Bookmarks.helpers({
     bookmarks: () => Template.instance().bookmarks.get(),
});

Template.Bookmark.helpers({
  isEditMode: () => Template.instance().isEditMode.get(),
  callbacks: () => {
    const inst = Template.instance();
    return {
      onUpdate: () => inst.isEditMode.set(false),
    };
  },
});
