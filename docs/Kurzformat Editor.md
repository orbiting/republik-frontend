# Kurzformat Editor

- [Introduction](#introduction)
- [Guides](#guides)
    - [Adding New Elements](#adding-new-elements)
    - [Adding New Marks](#adding-new-marks)
    - [Adding New Templates](#adding-new-templates)
    - [Saving Data](#saving-data)
- [Concepts](#concepts)
    - [Insertion](#insertion)
    - [Normalisation](#normalisation)
    - [Nodes Data](#nodes-data)
    - [Toolbars](#toolbars)
    - [Placeholders](#placeholders)
    - [Character Count](#character-count)
- [Config Options](#config-options)


## Introduction

This editor sits comfortably on top of [SlateJS](https://docs.slatejs.org/). It exists to provide the authorship of [Republik](https://www.republik.ch) with a tool that integrates into one's daily flow and allows to compose quick, of-the-moment, structured content.

Our ambition is to write scalable code, and make it easy for the new dev on the team to extend the editor with another element. Everything that's touching Slate is tucked away in the `/editor` folder. This includes decorators, UI elements, and the handful of abstractions we describe in the [concepts](#concepts) section. The rest comes down to configuration. The [guide section](#guides) walks you through ~~a crazy week in the life of Anna from IT~~ a few examples. If a comprehensive overview of the configuration options is what you are after, [we've got you covered](#config-options) too.

You don't need any Slate literacy to go through the [guides](#guides), but a working understanding of the framework may prove useful to those curious souls who wish to [dive further](#concepts).

## Guides

### Adding New Elements

*Monday:* Oli corners you in front of the coffee machine, and he really, really wants a carousel, because he thinks carousels are very cool. And indeed, you are getting chills, mostly because you know that carousels are tricky beasts. Can you throw a draft together before you've got to pick your kid at 6pm?

We begin by creating a `/carousel` subfolder in the `/elements` folder. This is where the configuration for Slate `elements` lives. 

 > `elements` are the building blocks of Slate. They always have a `type` and are rendered as blocks unless otherwise specified. The other type of custom nodes are `marks`. As the name suggests, marks are annotations to text leaves, e.g. bold. If you are not sure whether your new component is an element or a mark, then it's probably an element.
 
#### Specify a Complex Structure
 
Now that our carousel has a home, let's create a `carouselContainer` element. This consists in 2 steps:

1. Extend the type system to accommodate our new element and keep the compiler happy.
2. Write a config for the element.

For 1. we open `custom-types.d`, in the root folder. This file contains the type declaration of the editor.

1. a) We add the new element type:

```javascript
export type CarouselContainerElement = SharedElement & {
  type: 'carouselContainer'
}
```

1. b) We extend `CustomElement` and `CustomElementType`:

```javascript
export type CustomElement =
  | HeadlineElement
  | ParagraphElement
  ...
  | CarouselContainerElement

export type CustomElementsType =
  | 'headline'
  | 'paragraph'
  ...
  | 'carouselContainer'
```
*Yes, we are aware that there is duplication in here.*

For 2. we go back to our `/carousel` config folder. Let's specify the required configuration in `carousel/container.tsx`. No, this file doesn't exist yet. Yes, you should go ahead and create it. Here is what to put in it:

```javascript
import { ElementConfigI } from '../../custom-types'
import { ContainerComponent } from '../../editor/Element'

export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: [
    { type: 'carouselTitle' },
    { 
    	type: 'figure', 
    	repeat: [2,6]
    }
  ],
  attrs: {
    disableBreaks: true
  }
}
```
*To be implemented:* Repeats in structure.

So, how about we pretend we are computers and parse the file together?

`Component` defines the React component represented by the `CarouselContainer` element. It is often an element from the [Republik Styleguide](https://styleguide.republik.ch/). Here though, `ContainerComponent` is a Slate-compliant div that serves as configuration vessel.

> If your component does funny things, try reading [this](https://docs.slatejs.org/walkthroughs/03-defining-custom-elements). Slate has a handful of trivial requirements for React components, which are often satisfied by default (but not always).

The `structure` array tells us that `carouselContainer` should have a `carouselTitle`, and between 2 and 6 `figures` (image + caption). If this isn't the case, new nodes will be automatically inserted during the normalisation cycle of Slate, so that the structure of the document matches the one of the config.

> `structure` works recursively. For instance, `figure` also defines a structure for its descendants.

`disableBreaks` means that Slate shouldn't create a second carousel node when someone presses enter, like it would happen for paragraphs.

Very good. Now we need to define what `carouselTitle`does.

#### Import a Styleguide Compoment

From the top: we open `custom-types.d` and extend the types for `carouselTitle`:

```javascript
export type CarouselTitleElement = SharedElement & {
  type: 'carouselTitle'
}

export type CustomElement =
  | HeadlineElement
  ...
  | CarouselContainerElement
  | CarouselTitleElement

export type CustomElementsType =
  | 'headline'
  ...
  | 'carouselContainer'
  | 'carouselTitle'
```

Then we configure our element. We want the title of the carousel to look like an editorial subhead. `/carousel/title.tsx`:

```javascript
import { ElementConfigI } from '../../custom-types'
import { Editorial } from '@project-r/styleguide'

export const config: ElementConfigI = {
  Component: Editorial.Subhead,
  attrs: {
    disableBreaks: true,
  }
}
```

#### Handle Custom Data

*But what if a component needs data?* you may ask. 

Let's take an excursion through `figureImage`. This element has an `src` attribute baked in all the way down to its type definition:

```javascript
export type FigureImageElement = SharedElement & {
  type: 'figureImage'
  src?: string
}
```

And here is what the config looks like:

```jsx
import { FigureImage } from '@project-r/styleguide'
import {
  DataFormType,
  ElementConfigI,
  FigureImageElement,
  needsDataFn
} from '../../custom-types'
import React, { Attributes, ReactElement } from 'react'
import ImageInput from '../../Publikator/ImageInput'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
  element: FigureImageElement
}> = ({ attributes, children, element }) => {
  return (
    <div {...attributes}>
      <FigureImage {...element} />
      {children}
    </div>
  )
}

const DataForm: DataFormType<FigureImageElement> = ({
  element,
  setElement
}) => (
  <ImageInput
    onChange={(_: any, src: string) => {
      setElement({
        ...element,
        src
      })
    }}
  />
)

export const config: ElementConfigI = {
  Component,
  DataForm,
  dataRequired: ['src'],
  attrs: {
    isVoid: true
  }
}
```

You have two ways to edit your node's data. The first one is to set `editUi` to `true` in the `attrs`. This tells the editor to toggle a form on click.

`figureImage` does something different. Here, we provide a `DataForm` with the necessary UI to update our data, as well as a `dataRequired` array, which the code uses to determine if the form needs to be shown.

If the component requires some data (in our case, `src`), the wysiwyg editor disappears and the relevant `DataForm` is shown instead. The form vanishes once it is filled.

> The `Component` in this config is a good example of a Slate-compliant component: `attributes` are spread on the root div and `children` are returned last. `src` is an attribute of `element` and gets passed to `<FigureImage/>` as prop.

#### Putting Things Together

Last but not least, we import the configs into `/elements/index.tsx`:

```javascript
...
import { config as carouselContainer } from './carousel/container'
import { config as carouselTitle } from './carousel/container'

export const config: ElementsConfig = {
  paragraph,
  headline,
  link,
  ...
  carouselContainer,
  carouselTitle
}
```

> Please refrain from getting creative with the key names. They need to match the type of the elements.

Take that, Oli. Granted, an unstyled div isn't much of a carousel, but you didn't expect me to do ALL your work for you, did you? Go scour the Internet if [the one from the Styleguide](https://styleguide.republik.ch/teasercarousel) isn't good enough for you.

### Adding New Marks

*Tuesday:* After the smashing success of yesterday, Katharina comes to find you in your fancy office. (You are a very important member of the organisation and your office is super glossy.) Katharina does marketing and she always erupts with crazy ideas, so you are getting nervous. Turns out she read this guide and ~~would like~~ **needs** the strikethrough effect for this winter's promotional campaign. You aren't fully convinced. *Isn't it going to be a bit much?* you think. But then again, no one pays you to think, right?

Luckily for you, this one's easy. Marks generally are. You open `custom-types.d.ts` and extend the `CustomMarks` type:

```javascript
type CustomMarks = {
  ...
  sup?: boolean
  strikethrough?: boolean
}
```

You add a `strikethrough.tsx` config file in `/marks`:

```jsx
import { NodeConfigI } from '../custom-types'
import { Sub } from '@project-r/styleguide'
import { MdStrikethroughS } from '@react-icons/all-files/md/MdStrikethroughS'

const Component: React.FC<{
  attributes: Attributes
  children: ReactElement
}> = ({ children, attributes }) => (
  <span {...attributes} style={{ textDecoration: 'line-through' }}>
    {children}
  </span>
)

export const config: NodeConfigI = {
  Component,
  button: {
  	toolbar: 'hovering',
	icon: MdStrikethroughS
  }
}
```

The `button` configuration works for marks and elements alike. We offer two `toolbar` options: `hovering` xor `fixed`.

> You may or may not have noticed that this `Component` is, in fact, a span. It is expected from mark components that they behave and keep themselves inline (no divs here).

As a last step you include this config into `marks/index.tsx`, before getting back to Katharina with the satisfaction of a job well done:

```javascript
import { config as strikethrough } from './strikethrough'

export const config: MarksConfig = {
  italic,
  bold,
  sup,
  sub,
  strikethrough
}
```

### Adding New Templates

*Wednesday:* Uh-oh, there's Oli again. And he is giving you one of his signature scowls. In your haste to ship the new gallery element, you completely forgot to add it to the available templates and he can't use it yet. Sloppy.

Open the templates file (`/editor/ui/Select/Templates.tsx`) and add a `carousel` object at the end of the `templates` array:

```javascript
const templates: TemplateButtonI[] = [
	...
  { 
  	customElement: 'carouselContainer', 
  	label: 'Carousel', 
  	icon: MdViewCarousel 
  }
] 
```

For shorts, the custom element is always the last element. But the editor already knows that and stitches a full template on its own. Phew, it's only 9:30 and you need a nap. What a week.


### Saving Data

*Thursday:* You don't usually work on Thursdays, but for narration purposes, today is an exception.

XXX

## Concepts

### Insertion

Element insertion isn't as much a topic for the shorts as it would be for Republik's [Publikator](https://publikator.republik.ch). With the exception of `link` and `break`, custom elements come from the template.

We provide two ways to insert an element:

```jsx
<ToolbarButton
      button={element.button}
      disabled={disabled}
      onClick={() =>
        element.insert
          ? element.insert(editor)
          : element.node
          ? Transforms.insertNodes(editor, element.node)
          : console.warn(`Element ${elKey} missing insert/node definition`)
      }
/>
```

#### Node Definition

Most of the time, we just want to plop the new element wherever the cursor is. In this straightforward situation, we provide a `node` definition through the config and use Slate's `Transforms.insertNodes` function.

See `elements/break.tsx`:

```jsx
const node: BreakElement = {
  type: 'break',
  children: [{ text: '' }]
}

export const config: ElementConfigI = {
  Component,
  node,
  attrs: {
    isInline: true,
    isVoid: true
  },
  button: { 
	toolbar: 'fixed',
  	icon: MdKeyboardReturn 
  }
}
```

#### Insert Function

If the insert logic is more complicated than that, it is also possible to specify an `insert` function in the config.

Here is the one for `link`:

```jsx
const link = (editor: CustomEditor, href: string): void => {
  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const element: LinkElement = {
    type: 'link',
    href,
    children: isCollapsed ? [{ text: href }] : []
  }
  if (isCollapsed) {
    Transforms.insertNodes(editor, element)
  } else {
    Transforms.wrapNodes(editor, element, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const insert: InsertFn = editor => {
  const href = window.prompt('Enter the URL of the link:')
  return href && link(editor, href)
}
```

### Normalisation

Every time the value of the document changes (in plain text: every time someone edits something), Slate runs a normalisation cycle, where it checks that the document is still valid and fixes any problem.

While Slate also has [its own agenda](https://docs.slatejs.org/concepts/11-normalizing#built-in-constraints), normalisations can be extended ad lib. Which we did.

#### Match Structure

Our main addition is a normalisation steps that reads the `structure` from any given element's config and ensures it matches with the first-level descendants of the actual element. It moves along the descendants, deletes the ones which are the wrong type and inserts required missing nodes.

> If no structure is defined in the config, structure matching is skipped altogether (Slate default normaliser and any custom normaliser for this element will still run though).

Structure example from `/elements/chart/container.tsx`:

```javascript
export const config: ElementConfigI = {
  Component: ContainerComponent,
  structure: [
    { type: 'chartTitle' },
    { type: 'chartLead' },
    { type: 'chart' },
    { type: 'chartLegend' }
  ],
  attrs: {
    disableBreaks: true
  }
}
```

The same process runs recursively down the Slate tree, so descendants may also enjoy a round or two of structure matching. For instance, `chartLegend` could require `figureCaption` + `figureCredit`.

`type` can either be a simple element type, or a whole array of them, like in `/elements/figure/container.tsx`:

```javascript
export const config: ElementConfigI = {
  Component: FigureCaption,
  structure: [
    { type: ['text', 'link'], repeat: true },
    { type: 'figureByline' },
    { type: 'text', bookend: true }
  ],
  attrs: {
    formatText: true
  }
}
```

The first type of the array is also the insert type for missing nodes (here `text`).

*To be implemented:* Handle repetitions.

### Bookend Nodes

One of Slate's [built-in constraints](https://docs.slatejs.org/concepts/11-normalizing#built-in-constraints) is that inline nodes cannot be the first or last nodes of a parent block.

This is a bit of a problem. See once more `FigureCaption`, where `FigureByline` should be the last element:

```javascript
export const config: ElementConfigI = {
  Component: FigureCaption,
  structure: [
    { type: ['text', 'link'], repeat: true },
    { type: 'figureByline' },
    { type: 'text', bookend: true }
  ],
  attrs: {
    formatText: true
  }
}
```

We solve the problem by adding an attribute called `bookend` to text nodes. A bookend nodes sit at either end of the structure and do not contain any text. If one starts writing inside a bookend node, the text gets reallocated to the nearest non-bookend node in the next normalisation phase.

#### Custom Normalisers

Some elements (e.g. `FigureCaption`) still have the need for custom normalisation. An array of custom normalisers can be added to the config and is run automatically for the relevant element type at every normalisation cycle.

For instance `/elements/link.tsx` will remove any empty link:

```javascript
const unlink = (editor: CustomEditor, linkPath: Path): void => {
  Transforms.unwrapNodes(editor, { at: linkPath })
}

const unlinkWhenEmpty: NormalizeFn<LinkElement> = (
  [link, linkPath],
  editor
) => {
  if (!link.href) {
    unlink(editor, linkPath)
  }
}

export const config: ElementConfigI = {
  Component: Editorial.A,
  insert,
  normalizations: [unlinkWhenEmpty],
  attrs: {
    isInline: true,
    editUi: true,
    formatText: true
  },
  button: { icon: MdLink }
}
```

### Nodes Data

Editing a node's data is another requirement for any editor worth its salt. We offer two options.

#### editUi

If `attrs.editUi` is set to `true`, clicking on the element triggers a form for all the node's custom data (everything expect `type` and `children`). This works by adding an `EditableElement` around the `Component` in the `renderElement` function Slate uses.

```jsx
  const renderElement = useCallback(props => {
    const Component =
      elementsConfig[props.element.type as CustomElementsType].Component
    return (
      <EditableElement element={props.element}>
        <Component {...props} />
      </EditableElement>
    )
  }, [])
```

Which checks if the element is editable or not and toggles the form:

```jsx
export const EditableElement: React.FC<{
  element: CustomElement
  children: ReactElement
}> = ({ element, children }) => {
  const [isEdit, edit] = useState(false)
  ...
  
  const elementConfig = elementsConfig[element.type]
  if (!elementConfig || !elementConfig.attrs?.editUi) {
    return <>{children}</>
  }
  return (
    <ElementWrapper
      contentEditable={!isEdit}
      isInline={elementConfig.attrs?.isInline}
      onClick={(event: MouseEvent) => {
        event.preventDefault()
        edit(true)
      }}
      ref={editRef}
    >
      {children}
      {isEdit && <EditBox element={element} />}
    </ElementWrapper>
  )
}
```

*To be implemented:* Currently that form is very primitive. We need different field types for different data types (bool, string, choices, etc.).

#### DataForm

Another solution is to pass a `DataForm` to an element's config. This allows for more flexible data editing. The form takes two arguments: `value` and `onChange`.

Example from `/elements/images.tsx`:

```jsx
const DataForm: DataFormType<FigureImageElement> = ({
  element,
  setElement
}) => (
  <ImageInput
    onChange={(_: any, src: string) => {
      setElement({
        ...element,
        src
      })
    }}
  />
)
```

One component called `DataForms` iterates recursively through the Slate tree, and pulls the relevant forms. 

This is quite useful in the so-called `populate` step of the editing workflow, where this component is rendered whenever one of the node has some `dataRequired` missing.

> We separate the editing in 3 steps:
> 		
> 1. Select template
> 2. Populate data (e.g. upload an image, or configure a chart)
> 3. Edit text (this is where we actually use Slate) 

*To be implemented:* Pull the form when element is clicked, even if the data is set already (edit mode).

### Toolbars

Any element/mark that defines a `button` in the config can be rendered in either the `fixed` or the `hovering` toolbar.

#### Hovering Toolbar

The hovering toolbar appears when a section of the text is selected. It needs to be enabled via `attrs.formatText`.

The positionning of the bar itself is a bit of a tricky story, since it needs to account for situations where the bar would overflow to the left or to the right of the screen (on mobile).

*To be implemented:* Check for android compatibility.

### Placeholders

The `LeafComponent` renders text nodes and adds placeholder text when no actual text is present. The placeholder text is determined by the type of the parent element (e.g. `title` or `paragraph`).

```jsx
export const LeafComponent: React.FC<{
  attributes: Attributes
  children: ReactElement
  leaf: CustomText
}> = ({ attributes, children, leaf }) => {
  configKeys
    .filter(mKey => leaf[mKey])
    .forEach(mKey => {
      const Component = config[mKey].Component
      children = <Component>{children}</Component>
    })
  return (
    <span {...attributes} style={{ position: 'relative' }}>
      {!leaf.text && (
        <Placeholder leaf={leaf} element={children.props.parent} />
      )}
      {children}
    </span>
  )
}
```

*To be implemented:* Better placeholder text // disable feature.

### Character Count

The last important feature of something named "kurzformat" is the length – or rather, the shortness – for which we use the `withCharLimit` decorator. 

This decorator intercepts Slate's `insertText`, `insertFragment` and `insertNode` and triggers an early return wheneverr the aggregate of all text in the editor is more than the number of `maxSigns` specified in the editor config (currently 3000).

## Config Options

### Mark/Element Config

Name | Description
:--- | ---:
Component | Slate compliant React component
button | *see above*

#### `button`

Name | Description
:--- | ---:
icon | React icon
small | boolean

### Element-specific Config

Name | Description
:--- | ---:
insert | function
node | Slate node
DataForm | data form
needsData | array of node keys
normalizations | array of normalisers
placeholder | string
structure | array of `structure elements`
attrs | *see below*

#### `structure element`

Name | Description
:--- | ---:
type | custom element type (e.g. `figure`) or array of types
repeat | array of min and max repeats

#### `attrs`

Name | Description
:--- | ---:
isVoid | boolean
isInline | boolean
editUi | boolean
formatText | boolean
disableBreaks | boolean

### Editor Config

Name | Description
:--- | ---:
maxSigns | number
