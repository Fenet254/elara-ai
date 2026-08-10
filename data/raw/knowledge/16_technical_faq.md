---
title: Technical FAQ
version: 1.0
status: Draft
purpose: Technical interview knowledge base covering software engineering, backend, AI, machine learning, debugging, NLP, system design, and engineering practices.
---

# Technical FAQ

---

# Explain the difference between Software Engineering and Programming.

Programming is the process of writing code to solve a problem.

Software engineering is much broader.

It includes planning, designing, testing, debugging, maintaining, documenting, deploying, and improving software systems over time.

Programming is one part of software engineering.

Software engineering focuses on building systems that remain reliable, maintainable, and scalable.

---

# Why did you study Software Engineering instead of Computer Science?

I wanted to understand how complete software systems are built.

Software engineering focuses not only on algorithms but also on architecture, teamwork, project management, testing, deployment, and long-term maintenance.

That systems perspective matched how I naturally think.

---

# What happens when you type a URL into a browser?

Several things happen almost instantly.

The browser checks whether the address is already cached.

If not, DNS translates the domain name into an IP address.

The browser establishes a TCP connection.

If HTTPS is used, a TLS handshake secures the communication.

The browser sends an HTTP request.

The server processes the request.

The server returns an HTTP response.

The browser downloads HTML.

Then CSS.

Then JavaScript.

The browser builds the DOM.

It executes JavaScript.

Applies styles.

Renders the page.

Although this appears simple to users, many systems work together behind the scenes.

---

# Explain REST APIs.

REST APIs allow different applications to communicate using HTTP.

Instead of directly accessing another application's database, clients send requests.

The server processes the request.

Then returns data.

Common methods include:

GET

POST

PUT

PATCH

DELETE

REST separates the frontend from the backend, making systems easier to scale and maintain.

---

# Why are APIs important?

Without APIs, software systems would struggle to communicate.

Modern applications often involve:

Frontend

↓

Backend

↓

Authentication

↓

Database

↓

External Services

APIs connect all these components together.

---

# Explain JWT Authentication.

JWT stands for JSON Web Token.

After successful login, the server creates a signed token.

Instead of storing user information inside the server session, the client stores the token.

Every future request includes that token.

The server verifies the signature.

If valid, the request is authenticated.

JWT works well for distributed applications because servers don't need to store session information.

---

# Why should passwords never be stored as plain text?

If a database is compromised, attackers would immediately know every password.

Instead, passwords should be hashed.

Hashing converts passwords into fixed-length values that cannot easily be reversed.

When users log in, the entered password is hashed again and compared with the stored hash.

This protects users even if the database is exposed.

---

# Explain the difference between Authentication and Authorization.

Authentication answers:

"Who are you?"

Authorization answers:

"What are you allowed to do?"

A user may successfully authenticate but still lack permission to perform certain actions.

---

# SQL vs NoSQL?

SQL databases organize information into structured tables with predefined schemas.

Examples include MySQL and PostgreSQL.

NoSQL databases are generally more flexible.

MongoDB stores documents rather than tables.

Choosing between them depends on the application's requirements rather than one being universally better.

---

# Explain Machine Learning in simple words.

Traditional software follows rules written by developers.

Machine learning learns patterns from examples.

Instead of writing every rule manually, we provide data.

The model discovers relationships inside that data.

Later it uses those relationships to make predictions on new examples.

---

# What is Deep Learning?

Deep learning is a branch of machine learning that uses neural networks containing multiple layers.

These layers gradually learn increasingly complex representations.

Deep learning performs especially well on images, speech, natural language, and many pattern-recognition tasks.

---

# What is supervised learning?

Supervised learning uses labeled examples.

Each training sample already contains the correct answer.

The model learns the relationship between inputs and outputs.

Later it predicts outputs for new unseen data.

Spam detection is one example.

---

# Explain overfitting.

Overfitting happens when a model memorizes the training data instead of learning general patterns.

Training accuracy becomes very high.

Performance on new data becomes poor.

A useful model should generalize rather than memorize.

---

# Explain underfitting.

Underfitting occurs when a model is too simple to learn the underlying patterns.

Both training and testing performance remain poor.

The model has not learned enough.

---

# Why is data preprocessing important?

Models learn from data.

If the data contains errors, inconsistencies, missing values, duplicates, or poor formatting, model performance usually suffers.

Improving data quality often improves model performance more than changing architectures.

---

# Explain tokenization.

Tokenization converts text into smaller units that models can process.

Those units may be:

Characters.

Words.

Subwords.

Tokens become numerical representations that neural networks can understand.

Without tokenization, language models cannot process text.

---

# What is an embedding?

Neural networks cannot understand words directly.

Embeddings convert tokens into vectors.

Words with similar meanings often receive similar vector representations.

Embeddings allow models to learn semantic relationships instead of treating every word as completely independent.

---

# Explain Transformers.

Transformers are neural network architectures designed for sequence processing.

Unlike older recurrent networks, transformers process many tokens simultaneously.

Their most important idea is self-attention.

Self-attention allows every token to examine relationships with other tokens in the same sequence.

This makes transformers highly effective for language understanding.

---

# Why are Transformers better than traditional RNNs?

Traditional RNNs process sequences step by step.

Transformers process sequences in parallel.

This makes training significantly faster.

Transformers also capture long-range relationships more effectively using self-attention.

---

# What is self-attention?

Self-attention allows every word in a sentence to determine which other words are most important for understanding its meaning.

Instead of only considering nearby words, the model learns relationships across the entire sentence.

This ability is one reason transformers perform so well.

---

# Explain encoder and decoder.

The encoder receives input information and converts it into internal representations.

The decoder uses those representations to generate outputs.

Some transformer models use only encoders.

Others use only decoders.

Some combine both.

The architecture depends on the problem being solved.

---

# Why is dataset quality important?

A model cannot learn information that does not exist in its data.

Poor data usually produces poor models.

Better architectures cannot completely compensate for low-quality datasets.

That is why I consider understanding data just as important as understanding models.

---

# How do you debug machine learning models?

I avoid assuming the model itself is responsible.

Instead I investigate systematically.

First the data.

Then preprocessing.

Then tokenization.

Then architecture.

Then training.

Then evaluation.

Then inference.

Breaking the pipeline into stages makes debugging much more manageable.

---

# What is the biggest lesson AI has taught you?

That software can execute perfectly while still producing incorrect results.

Traditional debugging often focuses on code.

AI debugging requires understanding the entire learning pipeline.

That changed how I think about engineering.

---

# Why do you like NLP?

Language is one of the most interesting forms of human information.

Helping computers understand language combines software engineering, machine learning, mathematics, linguistics, and problem solving.

That interdisciplinary nature makes NLP especially interesting to me.

---

# Why are you interested in code intelligence?

Programming languages have structure.

Meaning.

Context.

Patterns.

Helping machines understand source code opens opportunities for automated debugging, documentation, code generation, security analysis, and software engineering assistance.

I believe code intelligence will continue becoming an important research area.

---

# Explain your debugging philosophy.

I believe understanding should come before fixing.

Rather than changing random lines until something works, I try to understand why it failed.

My mentor during my internship at INSA strengthened this mindset by requiring line-by-line code presentations.

That habit continues influencing how I investigate technical problems today.

---

# What makes a good engineer?

A good engineer writes code.

A great engineer understands systems.

They communicate clearly.

Debug systematically.

Continue learning.

Accept feedback.

Question assumptions.

And build software that remains useful long after it is written.

---

# Final Thought

Technology will continue evolving.

Programming languages will change.

Frameworks will change.

AI models will improve.

The engineers who continue growing will be the ones who never stop learning.

That is the mindset I try to maintain throughout my career.