---
title: Why Stilvoll?
description: Configuring Stilvoll using a config file
---

I initially created Stilvoll to scratch my own itch. Having never fully bought into the utility CSS for everything approach I wanted something that played nicely with component-scoped CSS. Essentially allowing you to only sprinkle in utility styles where needed.

## Why not utility only CSS?

First of all, I don't want to get sucked into highly emotional twitter drama on utility css. This is my stance, feel free to disagree, I don't mind.

### Unreadable Classname Strings

Yes, I said it. I hate how using a utility only approach can yield in very long and hard to read classnames. I know there's tools to help with that. But I think in web development we're using enough tools adding yet another step to our build process already, so I'm not convinced fixing my tools with meta-tools is the right approach.

Utility classes are fine for – well – doing utility things. But trying to author anything more complex only using atomic classnames becomes unbearable to me quickly. I just don't see the point adding 20+ classes to every HTML element.

### Learning Curve

While something like tailwind isn't the craziest of learning curves, it does feel like a domain specific language that sits on top of CSS. I do think there's a link to the popularity of utility only approaches here. If you have to learn all those classnames (or buy into their editor tooling) it only makes sense to just use them for everything.

## Why not component only CSS?

We have it good these days, with solutions like CSS Modules (or scoped styles in frameworks like Vue and Svelte), allowing us to neatly encapsulate our styles with our components. However, I do think, a component-only approach isn't the right solution either. Here's why, again, feel free to disagree, I don't mind.

### Weird Abstractions

I do think components and component-scoped styles really shine, if the abstraction a component represents is clear and defined. For something like a button, a card or a dialog it makes complete sense to create fully encapsulated abstractions. But what about layout primitives, like a column grid or horizontal spacing between different elements. I does feel weird to create components for these things. I've tried it a bunch of times, and always ended up with either super complex abstractions, or super specific components that only solve a layout for one particular case but aren't really re-usable. Trust me, I've written `display: flex;` to vertically lay items out in various components ad nauseam.

### One-off styles

I think we all know the situation, there's a card sitting on a page – alongside a bunch of other cards. And we need this one specific card to have more spacing from the next card than all the others. What do we do? We could add props and modifiers to our components. But that feels odd. After all a component should only care about what's inside itself, not what's around itself. We could create a super specific layout abstraction component that just handles that case. But more code means more maintenance liability, so do we really want a component, that in five months time no one will remember what it's for just to solve this issue? This is where utility CSS shines, just slab a `mt-xl` class on it and move on with your life.

## So what's the solution?

I do agree that at it's core utility css is a good idea. I also do think that the merits it's promising lead to people over-using it, ignoring that CSS offers a lot more to achieve the benefits utility only approaches offer. The same is true for component only approaches.

### Design tokens

Using CSS variable (aka custom prpoerties) for all design tokens – like color, spacings, font sizes, etc. – gives you a full system to standardize your app, without needing the "API surface" of dedicated utility classes. Design tokens can be used by both utility classes and in component styles. If you want a safety net you can always configure a lint rule to check that colors and spaces always come from CSS variables.

### Component Styles

As outlined above, encapsulated styles make a lot of sense for clearly scoped and well-known abstractions. This is my favorite way to write CSS, directly scoped to the component, nothing leaks to the outside.

### Utility Styles

Utility styles shine for one-off situations or for abstractions that don't make sense to encapsulate in a component (I'm mostly thinking of grids and other macro layout mechanisms here). Utility styles can also be used in place of a component until you know enough about the problem a component should be solving to actually encapsulate things. This also means having control over the utility classes is crucial, as the ones needed might differ from project to project.

## How does Stilvoll fit in here?

Stilvoll essentially is a utility CSS engine. Pointed to the CSS containing your design tokens and given a set of rule defintions to build it will spit out all permutations of utility classes ready to be used. Setting it up to parse your markup (out of the box HTML and JSX are supported) makes sure only the classes you're actually using end up in your production CSS bundle. This creates a set of ready-to-use utility sprinkles for you to use. You can choose to use the opinionted pre-defined rules from `@stilvoll/rules`, or [create your own rules](/guides/creating-rules). Rules can be defined as objects or CSS, so everything you'd manually write in CSS can be turned into an on-demand rule.

udditionally Stilvoll generates typedefinitions for your utility styles. So when you're working with Javascript components you can import `sv` into your component code and get full type-ahead for your utility classes without needing an extra plugin. Depending on the integration you're using the `sv` import compiles itself away in the build step or is replaced by a thin Javascript Proxy, so runtime overhead is zero or near-zero.
