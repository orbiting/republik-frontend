### `<Comment />`

```react
<Comment
  timeago='2h'
  displayAuthor={{
    profilePicture: profilePicture,
    name: 'Paul Ullrich',
    credential: {description: 'Bundesrat', verified: true}
  }}
  score={8}
  content='Ihr könnt ruhig über den Film Shades of Grey herziehen. Aber Mr. Grey ist verdammt heiss.'

  onAnswer={() => {}}
  onUpvote={() => {}}
  onDownvote={() => {}}
/>
```

### `<CommentHeader />`

```react|noSource,span-2
<CommentHeader
  name='Anonym'
  timeago='2h'
/>
```

```react|noSource,span-2
<CommentHeader
  name='Anonym'
  timeago='2h'
  credential={{description: 'Bundesrat', verified: true}}
/>
```

```react|noSource,span-2
<CommentHeader
  profilePicture={profilePicture}
  name='Jean Jacques Rousseau'
  timeago='2h'
/>
```

```react|noSource,span-2
<CommentHeader
  profilePicture={profilePicture}
  name='Paul Ullrich'
  timeago='2h'
  credential={{description: 'Bundesrat', verified: true}}
/>
```

```react|noSource,span-2
<CommentHeader
  profilePicture={profilePicture}
  name='Paul Ullrich'
  timeago='2h'
  credential={{description: 'Bundesrat', verified: false}}
/>
```

### `<CommentActions />`

```react|noSource
<CommentActions
  score={8}

  onAnswer={() => {}}
  onUpvote={() => {}}
  onDownvote={() => {}}
/>
```
