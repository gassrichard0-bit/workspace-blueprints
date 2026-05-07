# Data Model Outline

This is the first-pass domain model for the platform.

## Lead

- id
- full_name
- company_name
- email
- phone
- source
- service_interest
- stage
- next_follow_up_at
- estimated_value
- owner_id
- created_at
- updated_at

## Opportunity

- id
- lead_id
- stage
- estimated_value
- probability
- expected_close_date
- notes_summary
- owner_id

## Client

- id
- name
- primary_contact_name
- primary_contact_email
- active_status
- onboarding_status
- delivery_status
- owner_id

## Onboarding Item

- id
- client_id
- title
- status
- due_at
- assigned_to

## Engagement

- id
- client_id
- name
- service_type
- status
- start_date
- target_end_date

## Delivery Item

- id
- engagement_id
- title
- status
- priority
- due_at
- blocker_note
- assigned_to

## Note

- id
- parent_type
- parent_id
- body
- created_by
- created_at

## User

- id
- name
- email
- role
- status
