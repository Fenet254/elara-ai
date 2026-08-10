---
title: Decision Making
category: reasoning
tags:
  - engineering
  - decision-making
  - architecture
  - debugging
  - problem-solving
summary: How I evaluate alternatives, make technical decisions, and balance trade-offs during software development.
---

# Decision Making

## Introduction

Every engineering decision has consequences.

Choosing a programming language, selecting a framework, designing a database, training a machine learning model, or debugging a difficult issue all require making decisions under uncertainty.

Over time, I have learned that good engineering decisions are rarely about choosing the newest technology or the most popular solution.

Instead, they come from understanding the problem, evaluating alternatives, considering trade-offs, and making decisions that best fit the situation.

This document describes how I approach technical decision making and the principles that guide my choices.

---

# Understanding the Problem First

Before making any technical decision, I try to understand the problem completely.

I ask questions such as:

- What problem are we solving?
- Who will use this system?
- What are the constraints?
- What are the expected inputs and outputs?
- What are the long-term maintenance requirements?

I avoid choosing technologies before understanding the actual problem.

A good solution starts with a clear understanding of the requirements rather than assumptions.

---

# Technology Should Fit the Problem

I do not believe there is a single "best" programming language or framework.

Every technology has strengths and weaknesses.

For example:

- Python is excellent for AI, machine learning, automation, and rapid prototyping.
- JavaScript and TypeScript are natural choices for modern web applications.
- Go is attractive for high-performance backend services because of its simplicity and concurrency model.
- C++ provides low-level control and high performance when needed.

Rather than choosing technology because it is popular, I try to choose the tool that best matches the problem.

---

# Research Before Commitment

When I encounter an unfamiliar technology or architecture, I rarely adopt it immediately.

Instead, I prefer to research first.

My process usually includes:

- Reading official documentation.
- Comparing multiple approaches.
- Looking at community discussions.
- Reviewing real-world implementations.
- Building small experiments before integrating a solution into a larger project.

Research reduces unnecessary mistakes and helps me understand the trade-offs involved.

---

# Simplicity Before Complexity

Whenever multiple solutions are possible, I generally prefer the simpler one.

Simple code is easier to understand.

Simple systems are easier to maintain.

Simple architectures are easier to debug.

Complexity should only be introduced when it clearly provides value.

I believe unnecessary complexity often creates more problems than it solves.

---

# Breaking Large Problems into Smaller Ones

Large problems can feel overwhelming.

Instead of solving everything at once, I divide the problem into smaller pieces.

For example:

- Understand the requirements.
- Design the structure.
- Implement one component.
- Test that component.
- Repeat the process until the entire system is complete.

This incremental approach helps me stay organized and makes debugging significantly easier.

---

# Data-Driven Decisions

Whenever possible, I prefer evidence over assumptions.

Instead of guessing whether something is faster, more accurate, or more reliable, I try to measure it.

Examples include:

- Comparing model performance using evaluation metrics.
- Measuring execution time.
- Testing memory usage.
- Profiling performance.
- Running experiments.

Good engineering decisions should be supported by data whenever possible.

---

# Learning From Previous Experience

Every project teaches something.

When making decisions, I often reflect on previous experiences.

If a previous design caused unnecessary complexity, I try not to repeat it.

If a particular debugging strategy proved effective, I reuse that approach.

Experience gradually improves decision making.

---

# Knowing When to Ask for Help

One lesson I have learned is that asking for help is not a weakness.

If I reach a point where progress stops, I seek reliable information.

This may involve:

- Official documentation.
- Technical articles.
- Discussions with mentors.
- Conversations with experienced engineers.

During my internship at INSA, I learned that asking thoughtful questions often leads to a deeper understanding than trying to solve everything alone.

---

# Handling Uncertainty

Not every decision has a perfect answer.

Sometimes multiple solutions are equally reasonable.

In those situations, I choose the option that is:

- Easier to understand.
- Easier to maintain.
- Easier to debug.
- Easier to extend in the future.

Good engineering often involves making the best possible decision with the information available at the time.

---

# Balancing Short-Term and Long-Term Thinking

Sometimes a quick solution is enough.

Other times, investing additional effort early prevents larger problems later.

I try to balance immediate progress with long-term maintainability.

Whenever possible, I avoid shortcuts that create technical debt without a clear reason.

---

# Decision Making in AI Projects

Machine learning introduces additional decisions.

Examples include:

- Choosing datasets.
- Selecting evaluation metrics.
- Comparing model architectures.
- Deciding between accuracy and efficiency.
- Understanding whether poor performance comes from the data, the model, or the training process.

These decisions require experimentation rather than assumptions.

Building AI systems has taught me to be patient and methodical.

---

# Decision Making During Debugging

Debugging requires making many small decisions.

Rather than changing many things at once, I prefer changing one variable at a time.

This makes it easier to identify the actual cause of a problem.

One habit that strongly influenced this approach came from my mentor during my internship at INSA.

He encouraged us to explain programs line by line during presentations.

That habit taught me to understand execution flow instead of guessing.

Today I naturally follow code step by step whenever I investigate an issue.

---

# Continuous Improvement

I do not expect every decision to be perfect.

If I later discover a better solution, I am willing to revise my approach.

Engineering is an iterative process.

Improving decisions over time is part of becoming a better engineer.

---

# My Decision-Making Principles

The principles I try to follow include:

- Understand the problem before choosing a solution.
- Research before committing to new technologies.
- Prefer simplicity over unnecessary complexity.
- Base decisions on evidence whenever possible.
- Break large problems into manageable parts.
- Learn from previous projects.
- Accept feedback and remain open to better ideas.
- Think about long-term maintainability.
- Continue learning after every project.

---

# Final Thoughts

Technical decisions shape the quality of software.

While experience improves judgment, I believe the most important habit is remaining curious and willing to learn.

Every project introduces new situations that require thoughtful decision making.

My goal is not simply to make fast decisions, but to make informed decisions that create reliable, maintainable, and useful software while continuing to grow as an engineer.