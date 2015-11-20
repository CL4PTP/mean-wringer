The MEAN Wringer
================

This package is intented as an evaluation tool.  It is used to evaluate 
everything from problem comprehension to coding skills and style using 
real-world requirements to be implemented using the MEAN stack (though 
MongoDB is not used in this exercise).  In essence, the intent is to
__put you through the wringer__; hence the name of the project.

Instructions
------------

1. Install Git & Node.
2. Clone this repository: `> git clone https://github.com/fiveladdercon/mean-wringer.git`
3. NPM install: `> npm install`
4. Start the server: `> node server.js`
5. Direct your browser to `localhost:3000`
6. Read the rest of this README.md and complete the tasks.
7. Submit a <yourname> pull request when finished.


Client Side Requirements
------------------------

The application manages a collection of objects.  There are three classes
of object (Student, Course, Classroom), each with several instances.

The presentation and interaction with each object is made consistent through
the use of the mwObject transcluding AngularJS directive, which gives all objects
the same general look-and-feel.


__[R1]__ 
By default all objects need to be read-only.  An edit button is provided to 
unlock the objects, and when clicked, means the properties can be modified.  The 
edit button is replaced by a save button, that when clicked returns the objects 
back to a read-only state (and pushes changes to the server).

The Edit & Save buttons just toggle an editing boolean in the mwObject scope.
What's missing is the mechanism to disable/highlight form inputs.  This can
easily be done with the ng-class & ng-disabled Angular directives, but the
syntax is repetitive and error prone.  Instead, this functionality is to
be encapsulated in the mwLocking directive, which can be added to input tags:

    <input mw-locking ng-model='object.property'/>


__[R2]__
Students and Courses need to support one or more __attachments__, which are 
arbitrary files related to these objects that have been uploaded to the server.
(e.g. course materials can be attached to any given course).  Note that
Classroom objects do not support attachments.

To keep attachment management consistent, each object that supports attachments
is to instantiate an mwAttachements directive.  The directive needs to:

* Fetch & list the attachments related to the object, providing:
  - a way to delete the attachment (while editing),
  - a way to update the attachment file name (while editing)
  - a way to open the attachment (while not editing), and
  - a way to download the attachment (while not editing)

* Provide an Add button (while editing) that opens a file browser and allows 
  the upload of one or more files.  This button is to be styled similar to the 
  Edit/Save buttons, and thus can not be a displayed `<input type='file'/>` tag.

Uploads are to be POSTED immediately on Add (and the displayed list updated
on upload complete), while file name updates are to be PUT only when the 
object is saved.  Upload progress should be presented as a temporary placeholder(s) 
for the uploaded file(s) until they have been successfully uploaded.


__[R3]__
In addition to the Add button for adding attachments, attachments may be simply
be dropped anywhere on the object (while editing).  This capability is enabled 
via the attachable boolean in each object and requires modifying the mwObject
directive to support the HTML 5 drag-n-drop capability and coordinate the 
upload in the transcluded mwAttachables directive.


Server Side Requirements
------------------------

The server actually serves two things: a JSON REST API for managing server
resources and HTML/AngularJS web-client for initiating JSON requests and 
displaying the responses.

__[R4]__
Server side storage of attachments is to be abstracted from the client.
ALL attachment files are to be stored in a single flat folder and the
meta-data is to be stored in a database.  For example, a professor 
attaches a "syllabus.pdf" file to a Course object, the server will

* store this as:

    `uploads/S0MeRaNDoMsTriNG0fCHaRacTERs.pdf`

* store a meta-data record of:

    `{ 
    	id      : 10, 
      label   : 'syllabus.pdf'
    	object  : 'Course/1', 
    	file    : 'S0MeRaNDoMsTriNG0fCHaRacTERs.pdf'
    }`

* and present only the following meta-data to the client:

    `{ 
    	id         : 10, 
    	objectId   : 1, 
    	objectType : 'Course', 
      label      : 'syllabus.pdf'
    }`


__[R5]__
Attachment support must provided through the following JSON REST API:

#### GET /api/:type/:i/attachments  ####

Return a list of attachments for instance :i of object :type:

    [ 
      {id:integer, objectId:<:i>, objectType:<:type>, label:'string'}, 
      {id:integer, objectId:<:i>, objectType:<:type>, label:'string'},
      ... 
    ]

#### POST /api/attachments ####

Upload one or more files for instance :i of object :type.  Note that this is a 
multi-part post, where :i & :type need to be posted in addition to the file data.
When the upload completes, either one attachment or a list of attachments are
returned (depending on wheter one or many attachments where POSTed):

    [ 
      {id:integer, objectId:<:i>, objectType:<:type>, label:'string'}, 
      {id:integer, objectId:<:i>, objectType:<:type>, label:'string'},
      ... 
    ]

 -OR-

    {id:integer, objectId:<:i>, objectType:<:type>, label:'string'}

#### PUT /api/attachment/:x ####

Update the label of the attachment.  THIS IS TO ONLY CHANGE THE LABEL PROPERTY,
NOT THE FILE ON THE SERVER (SEE REQUIREMENT 4 ABOVE).  The updated object is
to be returned in the response:

    {id:integer, objectId:<:i>, objectType:<:type>, label:'string'}

#### GET /api/attachment/:x ####

Responds with attachment :x (for instance :i of object :type, which is implicit in :x).
If the query string includes ?download, forces a download in the client.

#### DELETE /api/attachment/:x ####

Deletes attachment :x, including the actual file.


Tasks
-----

__[T1]__ (AngularJS) Implement the mwLocking directive in client.js __[R1]__.

__[T2]__ (AngularJS) Implement the mwAttachments directive in client.js __[R2]__.

__[T3]__ (AngularJS) Add Attachment drag-n-drop support to the mwObject directive in client.js __[R3]__.

__[T4]__ (Node.js) Implement the create/read/update/delete/find methods in memory.js.

__[T5]__ (Node.js) Extend the Memory class in jsonfile.js to persist the struct list in a .json file __[R4]__.

__[T6]__ (Express) Implement the Attachments JSON API in server.js __[R5]__.


Evaluation Criteria
-------------------

In evaluating your submission, I expect __code correctness__ - which is to say that it 
does what it is required to do; and to do so out-of-the-box (following the first 5 steps
of the instructions above).  Beyond that I expect __coding eloquence__, which I mean to 
be an appropriate balancing of simplicity, efficiency, organization, readability and 
understandability against the complexity of funcional requirements.  And finally, I 
expect __coding rigour__, which means that your code is production worthy - i.e. 
commented, linted and regression tested.


Package Files
-------------

### Server Side Files ###

__server.js__    
> An Express application that serves an HTML client and a JSON REST API 
> or managing attachments.

__memory.js__ 
> A storage model that stores a list of structs with a common schema in memory, 
> giving each struct a unique id.

__jsonfile.js__
> A storage model that stores a list of structs with a common schema in a file 
> in JSON format, giving each struct a unique id.

### Client Side Files ###

__client.js__
> The Angular directives required for the HTML client.

__client.html__ 
> The HTML client that presents attachable and non-attachable objects in a list.

__object.html__
> An HTML template for displaying an object as a component with it's own controls.

### Project Files ###

__README.md__  
> This file.

__package.json__
> The npm package file listing dependencies (express, body-parser, multer).

__.gitignore__
> Disables tracking of node_modules in git.
