# `<Comment />`

```react
<Comment
  timeago='2h'
  displayAuthor={{
    profilePicture: profilePicture,
    name: 'Paul Ullrich',
    credential: {description: 'Bundesrat', verified: true}
  }}
  content='Ihr könnt ruhig über den Film Shades of Grey herziehen. Aber Mr. Grey ist verdammt heiss.'
/>
```

# `<CommentHeader />`

The only required props are name and timeago. The rest is optional.

```react
<CommentHeader
  name='Anonym'
  timeago='2h'
/>
```

```react
<CommentHeader
  name='Anonym'
  timeago='2h'
  credential={{description: 'Bundesrat', verified: true}}
/>
```


```react
<CommentHeader
  profilePicture={profilePicture}
  name='Jean Jacques Rousseau'
  timeago='2h'
/>
```

```react
<CommentHeader
  profilePicture={profilePicture}
  name='Paul Ullrich'
  timeago='2h'
  credential={{description: 'Bundesrat', verified: true}}
/>
```

```react
<CommentHeader
  profilePicture={profilePicture}
  name='Paul Ullrich'
  timeago='2h'
  credential={{description: 'Bundesrat', verified: false}}
/>
```


# `<CommentActions />`

```react
<CommentActions
  score={8}

  onAnswer={() => {}}
  onUpvote={() => {}}
  onDownvote={() => {}}
/>
```
