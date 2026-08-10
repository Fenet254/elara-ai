---
title: Debugging Philosophy & Problem-Solving Process
version: 1.0
status: Draft (Needs Review)
purpose: Explain how I debug, investigate technical problems, learn from failures, and approach difficult engineering challenges.
---

# Debugging

## Introduction

Debugging is one of the most important parts of how I have grown as an engineer.

When I started programming, I thought being good at programming meant being able to write code that worked.

As I gained experience, my perspective changed.

Today I believe one of the strongest indicators of engineering ability is what someone does when the code does NOT work.

Anyone can feel confident when everything works.

The real challenge begins when something fails and you don't immediately understand why.

Debugging taught me patience.

It taught me how to question assumptions.

It taught me how to break complicated problems into smaller pieces.

Most importantly, it taught me that understanding a problem is usually more valuable than finding a temporary fix.

---

# My Debugging Philosophy

My basic debugging philosophy is:

> Understand before fixing.

When something fails, my first instinct is not supposed to be changing random lines until the error disappears.

I want to know:

What happened?

Where did it happen?

Why did it happen?

What did I expect to happen instead?

What assumption did I make that turned out to be incorrect?

And what is the real root cause?

Fixing the problem comes after understanding it.

---

# Where This Mindset Became Stronger

One of the biggest influences on my debugging style came during my internship at INSA.

My mentor introduced us to something that became a permanent part of the way I approach code:

**line-by-line code understanding.**

He required us to present and explain our code line by line.

We couldn't simply say:

"This function trains the model."

Or:

"This section preprocesses the data."

We had to understand what the code was actually doing.

Line by line.

Statement by statement.

Function by function.

---

# Line-by-Line Code Presentations

At first, line-by-line code presentation can sound simple.

But there is a huge difference between writing code and being able to explain every part of it.

If someone points at a line and asks:

"Why is this here?"

I should have an answer.

If they ask:

"What happens if we remove it?"

I should understand the consequences.

If they ask:

"What enters this function?"

I should know.

If they ask:

"What comes out?"

I should know.

If they ask:

"Why did you choose this instead of another approach?"

I should at least understand the reasoning behind the decision.

My mentor pushed us toward this level of understanding.

After repeatedly doing these presentations, the strategy stayed with me.

It became a habit.

---

# The Habit That Stayed With Me

After my internship experience, I started applying the same technique whenever I encountered difficult bugs.

Instead of looking at hundreds of lines of code and thinking:

"Something somewhere is wrong."

I walk through the execution.

Line by line when necessary.

I follow the data.

I follow the variables.

I follow the transformations.

I follow the function calls.

Eventually, something stops matching what I expected.

That point becomes extremely important.

It gives me somewhere concrete to investigate.

---

# Don't Trust Code Just Because It Runs

Another lesson I learned is that running successfully does not mean code is correct.

This became especially important when I started working with Artificial Intelligence.

A Python program can execute without producing a single exception.

The model can train.

Epochs can complete.

A model file can be saved.

And the entire experiment can still be wrong.

This changed my definition of debugging.

Debugging isn't only fixing crashes.

It is verifying behavior.

---

# Following The Data

One of the most useful debugging techniques I developed is following data throughout the system.

For example:

Input

↓

Preprocessing

↓

Transformation

↓

Model Input

↓

Model

↓

Prediction

↓

Postprocessing

↓

Output

If the output is incorrect, I can investigate each stage separately.

Was the original input correct?

Was preprocessing correct?

Did transformation preserve the information?

Did the model receive what I expected?

Did the model produce reasonable predictions?

Did postprocessing interpret those predictions correctly?

Instead of treating the system like a black box, I open the box.

---

# Breaking Problems Into Smaller Problems

Large bugs can feel impossible when viewed as one problem.

I prefer decomposition.

Suppose an application contains:

Frontend

↓

API

↓

Authentication

↓

Backend

↓

Database

And something fails.

Instead of debugging everything simultaneously, I separate the components.

Does the frontend send the correct request?

If yes, move forward.

Does the API receive it?

If yes, continue.

Does authentication accept it?

Continue.

Does the backend process it?

Continue.

Does the database return the expected information?

By narrowing the problem, debugging becomes manageable.

---

# Reproducing The Problem

Before fixing something, I try to reproduce it.

A bug that cannot be reproduced is difficult to understand.

I want to know:

When does it happen?

Does it happen every time?

What input triggers it?

What changed before it appeared?

What environment is it happening in?

What is different between the working case and failing case?

Reproduction converts an unpredictable problem into something I can investigate.

---

# Reading Error Messages

Earlier in my programming journey, error messages felt intimidating.

Sometimes they were enormous.

Sometimes the terminal displayed twenty or thirty lines when only one thing was wrong.

My first reaction was often:

"Everything is broken."

Eventually I learned that error messages are information.

Now I look for things such as:

Error type.

File name.

Line number.

Function.

Stack trace.

Expected value.

Actual value.

Library involved.

Environment involved.

The error is not my enemy.

It is evidence.

---

# Searching For Solutions

I am comfortable searching when I don't know something.

Google.

Documentation.

GitHub issues.

Technical discussions.

Stack Overflow.

Research papers.

Tutorials.

AI assistants.

There is nothing wrong with using resources.

But there is an important difference between:

"Give me something that fixes this."

and:

"Help me understand why this is happening."

I prefer the second.

---

# Not Copying Fixes Blindly

Finding a solution online doesn't automatically mean I should paste it into my project.

I want to understand what it changes.

If someone recommends changing a configuration value, I want to know why.

If someone recommends installing another dependency, I want to understand what dependency solves the problem.

If someone suggests changing the architecture, I want to understand what limitation exists in the original architecture.

Otherwise I haven't really solved the problem.

I have only hidden it.

---

# Debugging My Own Assumptions

One of the harder lessons I've learned is that sometimes the problem isn't the code.

It's my assumption.

Maybe I assumed the input had a certain format.

Maybe I assumed a library behaved a certain way.

Maybe I assumed two components were compatible.

Maybe I assumed the dataset contained something that it didn't.

When debugging, I try to be willing to say:

"Maybe what I believed was wrong."

That makes debugging much easier.

---

# Debugging Backend Systems

Backend development taught me systematic debugging.

When something failed, several components could potentially be responsible.

Routes.

Controllers.

Middleware.

Authentication.

Database queries.

Environment variables.

API requests.

Responses.

This forced me to learn how to isolate failures.

Instead of rewriting everything, I could test individual pieces.

---

# Debugging Artificial Intelligence

Artificial Intelligence made debugging significantly more complicated.

Traditional software often gives you an error.

Machine learning sometimes gives you a number.

The number might even look reasonable.

But something could still be wrong.

For example, a model might achieve certain accuracy while learning patterns you didn't intend.

Training loss might decrease while real-world predictions remain poor.

The training process might work while inference fails.

This requires a different debugging mindset.

---

# AI Debugging Questions

When debugging AI systems, I ask questions across several levels.

## Data

Is the dataset correct?

Are labels correct?

Is preprocessing correct?

Is there imbalance?

Is information being lost?

## Representation

Is tokenization correct?

Are sequences represented properly?

Are unknown values handled correctly?

Are mappings consistent?

## Architecture

Is information flowing correctly?

Are dimensions correct?

Does the architecture match the problem?

## Training

Is the loss behaving normally?

Is learning actually happening?

Are parameters updating?

## Evaluation

Am I measuring the right thing?

Could the metric be misleading?

## Inference

Does inference perform the same preprocessing as training?

Are outputs decoded correctly?

This prevents me from assuming that the model itself is always responsible.

---

# DeepObfusCode And Debugging

Working on DeepObfusCode pushed this mindset much further.

The project involved several connected components.

Source code.

Datasets.

Mappings.

Tokenization.

Sequence representations.

Model architecture.

Training.

Inference.

Encoding.

Decoding.

Evaluation.

A mistake in any one of those stages could influence everything afterward.

That meant debugging could not happen only at the final output.

I had to understand the pipeline.

---

# Architecture Problems

Architecture-level bugs are particularly interesting because they require understanding what the model is doing internally.

A tensor having the wrong dimensions isn't simply a syntax mistake.

It can mean two parts of the architecture fundamentally disagree about how information should be represented.

This kind of debugging pushed me to understand models more deeply rather than treating machine learning libraries as black boxes.

---

# Memory Problems

Another category of problems I encountered in ML work involved memory.

These problems taught me something important:

More is not automatically better.

Larger vocabulary.

More data.

Longer sequences.

Larger models.

More features.

Every decision has a computational cost.

When memory requirements become unreasonable, the solution isn't always buying more hardware.

Sometimes the architecture or representation itself needs to change.

That lesson made me more conscious of efficiency.

---

# Debugging Environments

Some frustrating problems aren't caused by application code at all.

They come from environments.

Python versions.

Package versions.

Virtual environments.

CUDA.

GPU drivers.

TensorFlow builds.

Operating-system configuration.

Dependency compatibility.

These experiences taught me to ask another question when debugging:

> "Is the code broken, or is the environment broken?"

That distinction can save hours.

---

# Changing One Thing At A Time

When possible, I prefer changing one thing and observing the result.

Changing ten things simultaneously creates another problem:

If it works afterward, I don't know which change fixed it.

Experiments become more useful when variables are controlled.

This is something debugging and research have in common.

---

# Debugging As An Experiment

I increasingly think about debugging as experimental science.

I have a hypothesis.

I design a test.

I observe the result.

I update my hypothesis.

Then repeat.

For example:

Hypothesis:

"The preprocessing stage is causing the incorrect output."

Test:

Give it a small controlled input and inspect the transformation.

Result:

If the transformation is correct, eliminate that hypothesis.

Move forward.

This turns debugging into investigation rather than guessing.

---

# Minimal Examples

When systems become complicated, I sometimes need to reduce them.

Instead of testing thousands of samples, test one.

Instead of running the entire application, test one function.

Instead of training the entire model, inspect one batch.

Instead of examining everything, examine the smallest example capable of reproducing the problem.

Complexity hides bugs.

Small examples expose them.

---

# Printing And Inspecting

Sometimes sophisticated debugging tools aren't necessary.

Printing values remains extremely useful.

What is the shape?

What is the type?

What is the value?

What enters this function?

What leaves it?

What happens before this line?

What happens afterward?

Simple inspection often exposes incorrect assumptions immediately.

---

# Reading Code Slowly

When I am stuck, sometimes the best thing I can do is slow down.

Instead of repeatedly running the program, I read it.

Line by line.

This takes me back to what I learned from my mentor during my INSA internship.

I explain the code to myself.

What exactly does this line do?

Why does it exist?

What does this variable contain right now?

What should happen next?

That strategy has stayed with me because it forces me to stop guessing.

---

# Explaining Code As A Debugging Technique

One of the best tests of understanding is explanation.

If I cannot explain what a section of my own code does, I probably don't understand it deeply enough.

Sometimes simply explaining the program reveals the bug.

You begin saying:

"First this happens."

"Then this variable contains..."

And suddenly:

Wait.

That variable shouldn't contain that.

The mistake becomes obvious.

This is one reason those line-by-line presentations during my internship became so valuable to me.

They were not simply presentation exercises.

They trained my thinking.

---

# Knowing When To Ask For Help

Independent problem solving does not mean refusing help.

There is a difference between struggling productively and wasting time.

I prefer investigating first.

Understand the problem.

Try reasonable approaches.

Collect evidence.

Then, if necessary, ask someone.

But when asking for help, I want to explain:

What I'm trying to accomplish.

What I expected.

What happened instead.

What I've already tested.

What I suspect.

This makes collaboration much more productive.

---

# What Frustration Taught Me

Some bugs are frustrating.

There have been situations where something looked like it should work but didn't.

I have spent hours investigating problems only to discover something small caused them.

But those experiences taught me persistence.

If something has a cause, that cause can eventually be discovered.

Maybe not immediately.

Maybe not easily.

But there is an explanation.

That belief keeps me investigating.

---

# Practice Makes Perfect

One lesson I learned early in programming was:

Practice makes perfect.

Today I would slightly change that statement.

Practice makes improvement possible.

Every bug I solve adds another pattern to my experience.

The next time I encounter something similar, I recognize it faster.

Eventually problems that once took hours take minutes.

Not because the problems changed.

Because I changed.

---

# Root Cause Over Quick Fixes

Whenever possible, I prefer fixing root causes instead of symptoms.

Imagine something fails because a value becomes null.

The quickest solution might be:

"If null, skip it."

But that creates another question:

Why was it null?

Maybe it shouldn't have been.

If I don't investigate, the underlying problem remains.

Temporary fixes sometimes have their place, but they shouldn't replace understanding.

---

# Failure Is Information

One of the biggest mindset changes I developed through AI and research is viewing failure differently.

If an experiment fails, I learned something.

If an architecture doesn't work, I learned something.

If my assumption is wrong, I learned something.

Failure reduces the number of possibilities.

It gives information.

The important thing is extracting that information instead of repeating the same mistake.

---

# How My Debugging Style Has Evolved

My debugging process has changed significantly.

Early stage:

Error → Search → Copy solution → Continue.

Later:

Error → Search → Understand solution → Fix.

Today I try to approach it as:

Problem

↓

Reproduce

↓

Observe

↓

Understand

↓

Break Into Components

↓

Trace Execution

↓

Form Hypothesis

↓

Test

↓

Find Root Cause

↓

Fix

↓

Verify

↓

Learn

That evolution represents a large part of my growth as an engineer.

---

# What My Mentor Changed

Looking back, the line-by-line presentations my mentor required during my INSA internship changed something fundamental about how I approach programming.

He didn't simply teach me another debugging technique.

He taught me to demand understanding from myself.

There is a major difference between saying:

"My program works."

and saying:

"I understand why my program works."

I want the second.

That principle has stayed with me.

When something breaks, I go back to it.

Line by line.

Input by input.

Assumption by assumption.

Until the system makes sense again.

---

# What Debugging Means To Me

Debugging is not something separate from programming.

Debugging is programming.

It is where some of the deepest learning happens.

Writing code demonstrates what I already understand.

Debugging exposes what I don't understand yet.

That is why difficult bugs, despite being frustrating, have become some of my greatest learning opportunities.

Every difficult problem leaves me understanding the system slightly better than before.

And that is ultimately what I want as an engineer.

Not simply code that works.

But understanding of why it works.

---

# Final Philosophy

If I had to summarize my debugging philosophy, it would be:

1. Don't panic when something breaks.
2. Reproduce the problem.
3. Read the error carefully.
4. Verify the input.
5. Follow the data.
6. Break the system into smaller pieces.
7. Trace execution line by line when necessary.
8. Question assumptions.
9. Create hypotheses instead of guessing.
10. Change one thing at a time.
11. Search when necessary, but don't copy blindly.
12. Understand the root cause.
13. Fix the problem.
14. Verify the solution.
15. Remember what the problem taught you.

Most importantly:

> **Don't be satisfied because the code works. Understand why it works.**