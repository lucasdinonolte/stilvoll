---
title: Why Stilvoll?
description: Configuring Stilvoll using a config file
---

I started Stilvoll to solve my own problem. I’ve never been a fan of the utility CSS for everything approach. I wanted something that works well with component-scoped CSS, letting you sprinkle in utility styles only where you need them.

## Why skip utility-only CSS?

First off, I’m not here to dive into the Twitter drama around utility CSS. This is just my take—feel free to disagree!

### Unreadable Class Names

Yep, I said it. I can’t stand how utility-only CSS can lead to long, messy class names. Sure, there are tools to help with that, but we already juggle enough tools in web development. Adding more steps to our build process doesn’t feel right to me.

Utility classes are great for utility tasks, but trying to create anything complex with just atomic class names gets old fast. I just don’t see the point in slapping 20+ classes on every HTML element.

### Learning Curve

While Tailwind isn’t the hardest to learn, it feels like a whole new language on top of CSS. There’s a reason utility-only approaches are popular. If you have to memorize all those class names (or rely on their editor tools), it makes sense to use them everywhere.

## Why not component-only CSS?

We’re lucky these days with solutions like CSS Modules or scoped styles in frameworks like Vue and Svelte. They let us neatly wrap our styles with our components. But a component-only approach isn’t the best solution either. Here’s why—again, feel free to disagree!

### Weird Abstractions

Components and scoped styles really shine when the abstraction is clear and defined. For a button, card, or dialog, it makes total sense to create fully encapsulated components. But what about layout elements like a column grid or spacing between items? It feels off to create components for those. I’ve tried it a bunch of times, and I always end up with either overly complex abstractions or super specific components that only solve one layout case and aren’t reusable. Trust me, I’ve written permutations of `display: flex;` to vertically align items in various components way too many times.

### One-off Styles

We all know the feeling: there’s a card on a page with a bunch of others, and we need this one specific card to have extra space from the next. What do we do? We could add props and modifiers to our components, but that feels weird. A component should focus on what’s inside, not what’s around it. We could create a super specific layout component just for that case, but more code means more maintenance. Do we really want a component that no one will remember in five months just to solve this issue? This is where utility CSS shines—just slap something like a `mt-xl` class on it and move on!

## So what’s the solution?

I think utility CSS is a good idea at its core. But people often overuse it and ignore that CSS has more to offer. The same goes for component-only approaches.

### Design Tokens

Using CSS variables (custom properties) for all design tokens—like colors, spacing, font sizes, etc.—gives you a solid system to standardize your app without needing a bunch of dedicated utility classes. Design tokens work for both utility classes and component styles. If you want a safety net, you can set up a lint rule to ensure colors and spaces always come from CSS variables. There's a [stylelint plugin](https://github.com/AndyOGo/stylelint-declaration-strict-value) for that.

### Component Styles

As mentioned, encapsulated styles work great for clearly defined abstractions. This is my favorite way to write CSS—directly scoped to the component, with nothing leaking outside.

### Utility Styles

Utility styles are perfect for one-off situations or for abstractions that don’t make sense to wrap in a component (like grids and other layout mechanisms). You can also use utility styles instead of a component until you understand the problem well enough to encapsulate it. This means controlling the utility classes is key, as the needed ones might vary from project to project. Which is the main reason why Tailwind never really was an option to me.

## How does Stilvoll fit in?

Think of Stilvoll as a utility CSS engine. Point it to your CSS code containing your design tokens and give it some rule definitions, and it’ll generate all the utility class permutations you need. Setting it up to parse your markup (HTML and JSX are supported out of the box) ensures only the classes you actually use end up in your production CSS bundle. This gives you a set of ready-to-use utility sprinkles. You can stick with the pre-defined rules from `@stilvoll/rules`, or [create your own rules](/guides/creating-rules). You can define rules as objects or CSS, so anything you'd manually write in CSS can turn into an on-demand rule.

Plus, Stilvoll generates type definitions for your utility styles. When you’re working with JavaScript component frameworks, you can import `sv` into your code and get full type-ahead for your utility classes without needing an extra plugin. Depending on your integration, the `sv` import either compiles away in the build step or becomes a lightweight JavaScript Proxy, so the runtime overhead is zero or super minimal.
