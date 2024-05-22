# Django Kit - For integrating SvelteKit with Django
This is a simple library that helps you integrate SvelteKit with Django. It provides a simple way to
use Django as a backend and SvelteKit as a frontend, without hampering the reactivity provided by
SvelteKit.

It promotes SvelteKit's forms-actions heavily, and provides a way to use Django's forms with SvelteKit
without any hassle.

> Using Django's [Djapy](https://djapy.io/) is recommended for a more seamless integration.

## Installation
First, in your SvelteKit project, install the package using npm:
```bash
npm install @friendofsvelte/django-kit
```

Second, in your Django project, install the package using pip:
```bash
pip install djapy
```

## Usage

### Django
In your Django project, add the following to your `urls.py`:
```python
from django.urls import path
from django.http import JsonResponse
from djapy import django_kit

urlpatterns = [
    path('sveltekit/', django_kit),
    path('api/', lambda request: JsonResponse({'message': 'Hello from Django!'})),
]
```