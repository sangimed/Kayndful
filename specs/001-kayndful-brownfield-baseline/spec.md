# Feature Specification: Kayndful Brownfield Baseline

**Feature Branch**: `[001-kayndful-brownfield-baseline]`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Traduire le projet existant en spec compatible spec-kit"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Join the platform and complete onboarding (Priority: P1)

A new member can create an account, verify access, complete onboarding steps, and reach the community experience with a usable profile.

**Why this priority**: Without this flow, new users cannot enter the product or provide enough context (identity, location, availability) to interact safely.

**Independent Test**: Can be fully tested by creating a new account, completing onboarding steps, and confirming the member can access the main community area.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing screen, **When** they choose account creation and provide required inputs, **Then** they can continue through verification and onboarding.
2. **Given** a member in onboarding, **When** required identity and location rules are satisfied, **Then** they can proceed to the next steps.
3. **Given** onboarding is completed, **When** the member confirms the summary, **Then** they are routed to the main product experience.

---

### User Story 2 - Create, save, publish, and discover help requests (Priority: P1)

A member can browse neighborhood requests, filter/search them, save favorites, create drafts, edit drafts, and publish a request once validation rules pass.

**Why this priority**: Request creation and discovery are the core value loop of the product.

**Independent Test**: Can be fully tested by opening the request feed, applying filters, creating a draft, publishing a validated request, and seeing it listed.

**Acceptance Scenarios**:

1. **Given** a member opens the request feed, **When** they apply category/radius/query filters, **Then** only matching requests are shown.
2. **Given** a member creates a request draft, **When** they save it without publishing, **Then** the draft appears in draft management with updated timestamp.
3. **Given** a member attempts to publish, **When** required fields fail validation, **Then** publication is blocked and clear validation feedback is shown.
4. **Given** a valid request form, **When** publication succeeds, **Then** the request is marked as published and appears in the active list.

---

### User Story 3 - Coordinate help through conversations and account tools (Priority: P2)

A member can open request details, offer help, start or resume a conversation, exchange messages, mark messages as read, and manage account/profile information.

**Why this priority**: Once requests exist, successful completion depends on communication and profile trust signals.

**Independent Test**: Can be fully tested by opening a request, starting a conversation, sending messages, checking unread counters, and editing profile fields.

**Acceptance Scenarios**:

1. **Given** a member opens a request posted by someone else, **When** they confirm they want to help, **Then** a conversation is created (or reused) and can be opened.
2. **Given** a conversation exists, **When** the member sends a message, **Then** message history updates and unread counters reflect recipient state.
3. **Given** a member edits profile information, **When** they save valid changes, **Then** updated profile values are persisted and visible.

---

### User Story 4 - Run authenticated offer and points exchange workflows (Priority: P2)

An authenticated member can access protected API workflows to manage users, service offers, and point transfer transactions.

**Why this priority**: These backend capabilities support trusted exchange and point-economy operations.

**Independent Test**: Can be fully tested via authenticated API calls for registration/login/profile, offer CRUD, and transaction creation/listing.

**Acceptance Scenarios**:

1. **Given** a valid member account, **When** they authenticate, **Then** they receive usable access and refresh tokens.
2. **Given** a protected endpoint, **When** no valid token is provided, **Then** access is denied.
3. **Given** a buyer has enough points, **When** a transaction is created for an offer, **Then** buyer points decrease, provider points increase, and a transaction record is stored.
4. **Given** a buyer has insufficient points, **When** they attempt a transaction, **Then** the request is rejected with a clear error.

---

### Edge Cases

- What happens when a member is offline while loading feeds, search, inbox, or chat?
- How does the system handle duplicate registration attempts with an already used phone number?
- What happens when a user tries to publish a request containing blocked content (contact details, full address, profanity)?
- How does the API respond when a protected route receives a missing, invalid, or expired token?
- What happens when a transaction references missing users/offers or requests more points than available?
- How does the product behave when tabs or destination routes are not yet fully wired?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow account registration and authentication with access and refresh credentials.
- **FR-002**: System MUST allow retrieval of authenticated member profile information.
- **FR-003**: System MUST block protected resources when authentication is missing or invalid.
- **FR-004**: System MUST support a multi-step onboarding flow that captures identity, location, optional profile enrichment, skills, and availability.
- **FR-005**: System MUST prevent progression past required onboarding steps unless required fields are valid.
- **FR-006**: System MUST allow members to browse help requests with pagination and sorting.
- **FR-007**: System MUST support request discovery filters including category, distance/radius, channel, text query, and XP threshold.
- **FR-008**: System MUST provide request search in list and map-oriented views.
- **FR-009**: System MUST allow request drafts to be saved, updated, listed, deleted, and fully cleared.
- **FR-010**: System MUST enforce request publication validation rules (required fields, content-safety checks, volunteer limits, rule acceptance).
- **FR-011**: System MUST allow members to bookmark and retrieve saved requests.
- **FR-012**: System MUST allow members to view request details and initiate or resume a conversation with request authors.
- **FR-013**: System MUST support messaging flows including message history, send action, and unread-state updates.
- **FR-014**: System MUST allow profile editing (name, bio, area, skills) and reflect updates in relevant user-facing surfaces.
- **FR-015**: System MUST support authenticated CRUD operations for service offers.
- **FR-016**: System MUST support authenticated user listing, lookup, update, and deletion operations.
- **FR-017**: System MUST support authenticated point-transfer transactions tied to service offers, with balance updates for both parties.
- **FR-018**: System MUST reject point transfers when source balance is insufficient.
- **FR-019**: System MUST expose API documentation for available routes.
- **FR-020**: System MUST provide seedable baseline data for local validation/demo workflows.
- **FR-021**: System MUST preserve a defined monthly bonus rule for premium accounts as a scheduled capability, even if not yet active.

### Key Entities _(include if feature involves data)_

- **User**: Registered member with identity, location, profile attributes, account type, and points balance.
- **Service Offer**: Provider-created offer including title, description, category, availability, and point cost.
- **Transaction**: Points transfer record linking a source user, destination user, related service offer, and transferred points.
- **Request**: Community help request with title, category, urgency/time metadata, location context, media, tags, and author.
- **Request Draft**: Persisted editable request-in-progress containing publication fields and form metadata.
- **Conversation**: Context linking participants and a request with unread counters and completion marker.
- **Message**: Timestamped communication unit exchanged between two participants inside a conversation.
- **Neighborhood/Zone**: Geo-scoped context used for radius-based filtering and discovery.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of protected actions are denied when authentication is missing, invalid, or expired.
- **SC-002**: A new member can complete onboarding from first screen to summary in 6 steps without dead-end navigation.
- **SC-003**: Members can save and retrieve request drafts with no data loss across app restarts.
- **SC-004**: Valid published requests become discoverable in feed/search immediately after publication.
- **SC-005**: Request publication rejects invalid submissions with field-level feedback in all required validation categories.
- **SC-006**: From a request detail screen, a member can start or resume a conversation in at most 2 primary actions.
- **SC-007**: For each successful transaction, exactly one transaction record is created and both user balances are updated consistently.
