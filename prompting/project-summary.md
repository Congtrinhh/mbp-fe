# Project Name: MC Booking Platform (MBP)

## Technology Stack:

-   Backend: ASP.NET Web API with Clean Architecture, using .net 8.0
-   Frontend: Vue.js: Vue 3 with the Composition API, when writing vue code, remember to write in vue 3 composition api style. I use PrimeVue as an ui library. with pinia, I prefer option store style
-   Object Storage: AWS S3
-   Authentication: JWT combined with Google login
-   Database: MySQL

## Overview

The project has user and admin side which affect front-end and back-end project structure:

-   Admin side is for administrative operations such as role management, user management, resource management, post management,..
-   User side is the pages where MCs and MC bookers work

## Core features

-   MC profile
-   Booking MCs
-   User identification verification
-   Contract between MC and MC bookers
-   JWT authentication combined with Google login

# Note

-   While implementing features, don't break the existing flow, don't remove code that should not be removed
-   do not be lazy, don't omit code
