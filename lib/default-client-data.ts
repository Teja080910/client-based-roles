export const resources = [
    'course',
    'program',
    'event',
    'header',
    'translation',
    'discount-code',
    'user-specific'
]

export const roles = [
    'FINANCE_ADMIN',
    'CENTER_ADMIN',
    'NATIONAL_ADMIN',
    'PROGRAM_ORGANIZER',
    'SUPER_ADMIN',
    'TEACHER',
    'CAPS_ADMIN',
    'PARTICIPANT',
    'uma_protection'
];

export const scopes = [
    'header:help-desk',
    'header:register',
    'course:participant-refund',
    'course:edit-fees-always',
    'course:approve-reject-edit',
    'course:course-request-discount',
    'course:edit-course-status-based',
    'program:delete-venue-always',
    'program:edit-venue-always',
    'program:additional-sale-request',
    'program:update_bank_transfer_payment_status',
    'course:course-description-editable-always',
    'course:new-course-is-geo-restriction-applicable-for-registrations',
    'course:new-course-registration-is-mandatory-for-this-course',
    'course:display-language-translation',
    'course:registration-via-3rd-party-url',
    'course:new-course-co-teaching',
    'course:new-course-teaching',
    'course:approve-caf',
    'course:edit-caf',
    'caps:admin',
    'course:participant-transfer-approve-reject',
    'course:expense_fee',
    'course:undo_cancel_course',
    'course:activity_report',
    'course:participant_details_report',
    'course:details_report',
    'course:iaolf_report',
    'discount-code:course-start-date',
    'discount-code:state',
    'discount-code:city',
    'discount-code:approval-or-reject',
    'event:3rd-party-gateway-registration',
    'event:display-language-translation',
    'event:apply-geo-restriction-for-registrations',
    'event:activity_report',
    'program:delete-program',
    'event:edit-event',
    'program:edit-program-accounting-based',
    'translation:admin',
    'translation:developer',
    'translation:end-user'
];

export const policies = [
    {
        name: "Only Finance Admin Policy",
        type: "role",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            roles: [
                { id: "FINANCE_ADMIN", required: false }
            ]
        }
    },
    {
        name: "Only Center Admin Policy",
        type: "role",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            roles: [
                { id: "CENTER_ADMIN", required: false }
            ]
        }
    },
    {
        name: "Only National Admin Policy",
        type: "role",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            roles: [
                { id: "NATIONAL_ADMIN", required: false }
            ]
        }
    },
    {
        name: "Only Program Organizer Policy",
        type: "role",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            roles: [
                { id: "PROGRAM_ORGANIZER", required: false }
            ]
        }
    },
    {
        name: "Only Super Admin Policy",
        type: "role",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            roles: [
                { id: "SUPER_ADMIN", required: false }
            ]
        }
    },
    {
        name: "Only Teacher Policy",
        type: "role",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            roles: [
                { id: "TEACHER", required: false }
            ]
        }
    },
    {
        name: "All Admin Policy",
        type: "aggregate",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            applyPolicies: ["Only Finance Admin Policy", "Only National Admin Policy", "Only Super Admin Policy"]
        }
    },
    {
        name: "Only Caps Admin Policy",
        description: "",
        type: "user",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            users: ["caps-admin@artofliving.org"]
        }
    },
    {
        name: "Help Desk Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["header:help-desk"],
            applyPolicies: ["Only National Admin Policy", "Only Super Admin Policy"]
        }
    },
    {
        name: "Discount Code Course Start Date Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["discount-code:course-start-date"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Discount Code State Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["discount-code:state"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Discount Code City Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["discount-code:city"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Discount Code Approval or Reject Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["discount-code:approval-or-reject"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Register Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["header:register"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Participant Refund Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:participant-refund"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Fee Section Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:edit-fees-always"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Approve or Reject Course Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:approve-reject-edit"],
            applyPolicies: ["Only National Admin Policy", "Only Super Admin Policy"]
        }
    },
    {
        name: "Delete Venue Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["program:delete-venue-always"],
            applyPolicies: ["All Admin Policy", "Only Center Admin Policy"]
        }
    },
    {
        name: "Edit Venue Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["program:edit-venue-always"],
            applyPolicies: ["All Admin Policy", "Only Center Admin Policy"]
        }
    },
    {
        name: "Update Payment Status For Bank Transfer Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["program:update_bank_transfer_payment_status"],
            applyPolicies: ["Only Finance Admin Policy", "Only National Admin Policy"]
        }
    },
    {
        name: "Course Description Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:course-description-editable-always"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Is Geo Restriction Applicable For Registrations Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:new-course-is-geo-restriction-applicable-for-registrations"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Registration Is Mandatory For This Course Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:new-course-registration-is-mandatory-for-this-course"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Display Language Translation For Participants Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:display-language-translation"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Registration Via Third Party gateway Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:registration-via-3rd-party-url"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "New Co-teaching Course Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:new-course-co-teaching"],
            applyPolicies: ["Only Teacher Policy"]
        }
    },
    {
        name: "New Teaching Course Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:new-course-teaching"],
            applyPolicies: ["Only Teacher Policy"]
        }
    },
    {
        name: "Caps Admin Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["caps:admin"],
            applyPolicies: ["Only Caps Admin Policy"]
        }
    },
    {
        name: "Approve Course Accounting Form Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:approve-caf"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Edit Course Accounting Form Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:edit-caf"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Approve or Reject Participant Transfer Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:participant-transfer-approve-reject"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Course Expense Fee Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:expense_fee"],
            applyPolicies: ["Only National Admin Policy", "Only Super Admin Policy"]
        }
    },
    {
        name: "Undo Cancel Course Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:undo_cancel_course"],
            applyPolicies: ["All Admin Policy", "Only Center Admin Policy"]
        }
    },
    {
        name: "Course Activity Report Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:activity_report"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Event Activity Report Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["event:activity_report"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Course IAOLF Report Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:iaolf_report"],
            applyPolicies: ["Only Super Admin Policy", "Only National Admin Policy"]
        }
    },
    {
        name: "Participant Details Report Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:participant_details_report"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Course Details Report Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:details_report"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "3rd Party Gateway Registration Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["event:3rd-party-gateway-registration"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Display language translation Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["event:display-language-translation"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Apply Geo-Restriction for Registrations Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["event:apply-geo-restriction-for-registrations"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Edit Event Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["event:edit-event"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Edit Program accounting based Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["program:edit-program-accounting-based"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Delete Program Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["program:delete-program"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Only Translation Admin Policy",
        description: "",
        type: "user",
        logic: "POSITIVE",
        decisionStrategy: "UNANIMOUS",
        config: {
            users: [""]
        }
    },
    {
        name: "Translation Page Developer Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["translation:developer"],
            applyPolicies: ["Only Super Admin Policy"]
        }
    },
    {
        name: "Translation Page End User Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["translation:end-user"],
            applyPolicies: ["Only Super Admin Policy", "Only National Admin Policy"]
        }
    },
    {
        name: "Translation Admin Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["translation:admin"],
            applyPolicies: ["Only Translation Admin Policy"]
        }
    },
    {
        name: "Additional Sale Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["program:additional-sale-request"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Edit course Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:edit-course-status-based"],
            applyPolicies: ["All Admin Policy"]
        }
    },
    {
        name: "Course request discount code Permission",
        description: "",
        type: "scope",
        logic: "POSITIVE",
        decisionStrategy: "AFFIRMATIVE",
        config: {
            scopes: ["course:course-request-discount"],
            applyPolicies: ["Only Teacher Policy", "Only Program Organizer Policy"]
        }
    }
]