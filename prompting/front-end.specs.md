# Frontend Development Standards

You are an expert in **TypeScript**, **Node.js**, **Vite**, **Vue.js**, **Vue Router**, **Pinia**, **PrimeVue**, **Zod.js**, and **Tailwind**, with a deep understanding of best practices and performance optimization techniques in these technologies.

---

## Code Style and Structure

-   No more than 500 line of codes in each files.
-   Write concise, maintainable, and technically accurate TypeScript code with relevant examples.
-   Use functional and declarative programming patterns; avoid classes.
-   Favor iteration and modularization to adhere to DRY principles and avoid code duplication.
-   Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
-   Organize files systematically:
    -   Each file should contain only related content, such as exported components, subcomponents, helpers, static content, and types.
-   SFC content order: template => script => style

---

# Folder Location

D:/\_\_\_Đồ án/MBP/Frontend

# Platform

-   Chrome web browser
-   Safari web browser
-   Firefox web browser
-   Other web browsers

## Naming Conventions

-   Use lowercase with dashes for directories (e.g., `components/auth-wizard`).
-   Favor named exports for functions.

---

## TypeScript Usage

-   Use TypeScript for all code.
-   Prefer **interfaces** over **types** for their extendability and ability to merge.
-   Avoid **enums**; use **maps** instead for better type safety and flexibility.
-   Use functional components with TypeScript interfaces.

---

## Syntax and Formatting

-   Use the `function` keyword for pure functions to benefit from hoisting and clarity.
-   Always use the **Vue Composition API** `script setup` style.

---

## UI and Styling

-   Use **PrimeVue**, **Zo**, and **Tailwind** for components and styling.
-   Implement responsive design with Tailwind CSS; use a **mobile-first** approach.

---

## Performance Optimization

-   Wrap asynchronous components in **Suspense** with a fallback UI.
-   Use **dynamic loading** for non-critical components.
-   Optimize images:
    -   Use **WebP** format
    -   Include **size data**
    -   Implement **lazy loading**
-   Implement an optimized chunking strategy during the **Vite** build process:
    -   Use **code splitting** to generate smaller bundle sizes.

---

## Key Conventions

-
-   Optimize **Web Vitals** (LCP, CLS, FID) using tools like **Lighthouse** or **WebPageTest**.

## Note

-   Use PrimeVue as UI library: for form validation, components,..: https://primevue.org/
-   When creating new components, prefix the name of component with M letter. for example MImageViewer, MMcItem,.. to differentiate between components from MBP and other libraries.
-   This app is MBP (MC Booking Platform) running mostly in browser of mobile devices (iphone, android phones), so the UI should be mobile user-friendly with actions like touch, swipe up, swipe down, scroll,..
-   Most of the users (80%) use iphone, so the ux should be mobile-friendly for iphone users.
-   The front-end use vue.js 3 with composition style, with vite build tool.
-   Use pinia as state management tool. with pinia, write code in option api style.
-   Primevue Components are imported globally so there is no need to import in each components.

## Security

-   Prevent common security vulnerabilities such as: XSS

## Css and styling

-   prioritize style in the <style> instead of inline style.
