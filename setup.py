# -*- coding: utf-8 -*-
try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

setup(
    name = 'skb',
    version = '0.1',
    description = '',
    author = '',
    author_email = '',
    install_requires = [
        "pecan",
    ],
    zip_safe = False,
    paster_plugins = ['Pecan'],
    include_package_data = True,
    packages = find_packages(exclude=['ez_setup'])
)
