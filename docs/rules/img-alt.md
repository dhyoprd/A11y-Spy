# Image Alt Rule

Rule ID: `a11y-spy/img-alt`

Status: available in v0.1

## What It Checks

This rule reports native `<img>` elements that do not have an explicit `alt` attribute in supported HTML, JSX, and TSX documents.

```html
<img src="/hero.png">
```

Diagnostic:

```text
Image element is missing an alt attribute.
```

## Preferred Fix

If the image conveys information, write meaningful alt text:

```html
<img src="/hero.png" alt="Dashboard showing accessibility warnings">
```

If the image is decorative, an empty alt attribute is appropriate:

```html
<img src="/divider.png" alt="">
```

The v0.1 quick fix inserts `alt=""` and is titled `Add alt="" for decorative image`.

## Suppressed Cases

The rule does not warn when the image is explicitly hidden or presentational:

```html
<img src="/divider.png" alt="">
<img src="/divider.png" aria-hidden="true">
<img src="/divider.png" role="presentation">
<img src="/divider.png" role="none">
```

In JSX and TSX, statically obvious hidden or presentational values are also suppressed:

```tsx
<img src="/divider.png" aria-hidden />
<img src="/divider.png" aria-hidden={true} />
<img src="/divider.png" role="presentation" />
```

Images with JSX spread props are not reported in v0.1 because the spread may provide `alt`:

```tsx
<img src={heroUrl} {...imageProps} />
```

## Limits

v0.1 checks only native lowercase JSX/TSX `<img>` elements and HTML image elements. It does not check framework components such as Next.js `<Image>` or `<input type="image">`.

Documents larger than 500 KB are skipped to keep live editor diagnostics responsive.
