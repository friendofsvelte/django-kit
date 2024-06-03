# Django Kit - For integrating SvelteKit with Django

This is a simple library that helps you integrate SvelteKit with Django. It provides a simple way to
use Django as a backend and SvelteKit as a frontend, without hampering the reactivity provided by
SvelteKit.

It promotes SvelteKit's forms-actions heavily, and provides a way to use Django's forms, and validation with SvelteKit
without any hassle.

### Why use Django Kit?

People usually use `fetch` to send data to the backend, and then handle the response. This is a good way to do it, but
it reduces the reactivity of SvelteKit. Django Kit provides a way to use Django's forms and validation with SvelteKit
keeping the reactivity intact, `$page.form` is updated automatically when the form is submitted.

> Using Django's [Djapy](https://djapy.io/) is recommended for a more seamless integration.

### Features

- Use Django's forms and validation with SvelteKit.
- Flash messages are automatically shown in SvelteKit.
- Custom/manual toast messages can be shown.
- Cookie management is handled automatically, or you can do it manually.

## Installation

First, in your SvelteKit project, install the package using npm:

### SvelteKit

In your SvelteKit project, install the package using npm:

```bash
npm install @friendofsvelte/django-kit
```

Use the package in your SvelteKit project, in your `+page.server.ts`:

```javascript
import {via_route_name} from '@friendofsvelte/django-kit';

export const actions = via_route_name(["login", "register", "logout"]);
// you need to setup django-kit-fos in your Django project
```

#### Via route name

The `via_route_name` function takes an array of route names, and returns an object with the same keys. The object has
functions that can be used to submit forms to the backend.
You can call `GET` or `POST` api endpoints using the functions returned by `via_route_name`.

```javascript
import {via_route_name} from '@friendofsvelte/django-kit';

export const actions = via_route_name([{name: "search_users", method: "GET"}]);
// converts the search formdata to query params
```

#### Via route path

The `via_route_path` function takes an array of route paths, and returns an object with the same keys. The object has
functions that can be used to submit forms to the backend.

```javascript
import {via_route_path} from '@friendofsvelte/django-kit';

export const actions = via_route_path(["/login", "/register", "/logout"]);
```

This can also be used to call `GET` or `POST` api endpoints using the functions returned by `via_route_path`.

You can also pass route prefix, and the function will automatically prepend the prefix to the route path.

```javascript
import {via_route_path} from '@friendofsvelte/django-kit';

export const actions = via_route_path(["login", "register", "logout"], "/api");
```

### Django

If you're using Django as a backend, you can use the `django-kit-fos` package to integrate Django with SvelteKit.

In your Django project, install the package using pip:

```bash
pip install django-kit-fos
```

In your Django project, add the following to your `urls.py`:

```python
from django.urls import path
from django_kit_fos import trigger_pattern

urlpatterns = [
    # Your other paths
] + trigger_pattern
```