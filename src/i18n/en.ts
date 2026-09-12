const en = {
  translation: {
    common: {
      appName:
        "Voting System",

      casa:
        "Cambodia Agricultural Science Academy",

      administrationTitle:
        "CASA Administration",

      dashboard:
        "Dashboard",

      elections:
        "Elections",

      results:
        "Results",

      users:
        "Users",

      auditLogs:
        "Audit Logs",

      corrections:
        "Vote Corrections",

      signIn:
        "Sign In",

      logout:
        "Logout",

      loading:
        "Loading...",

      save:
        "Save",

      cancel:
        "Cancel",

      create:
        "Create",

      edit:
        "Edit",

      delete:
        "Delete",

      view:
        "View",

      back:
        "Back",

      refresh:
        "Refresh",

      search:
        "Search",

      actions:
        "Actions",

      status:
        "Status",

      active:
        "Active",

      inactive:
        "Inactive",

      enabled:
        "Enabled",

      disabled:
        "Disabled",

      allowed:
        "Allowed",

      notAllowed:
        "Not Allowed",

      draft:
        "Draft",

      scheduled:
        "Scheduled",

      live:
        "Live",

      closed:
        "Closed",

      archived:
        "Archived",

      admin:
        "Admin",

      superAdmin:
        "Super Admin",

      user:
        "User",

      all:
        "All",

      yes:
        "Yes",

      no:
        "No",

      noData:
        "No data available",
      previous: "Previous",
      
      next: "Next",
      
      close: "Close",
    },

    public: {
      heroLabel:
        "Secure Election Platform",

      title:
        "Voting System",

      subtitle:
        "Participate securely in active voting elections and view results according to election rules.",

      activeElections:
        "Active Elections",

      voteNow:
        "Vote Now",

      viewResults:
        "View Results",

      noElections:
        "No active elections are currently available.",
    },

    auth: {
        administration:
            "Administration",

        title:
            "Sign In",

        description:
            "Enter your administrator credentials to continue.",

        email:
            "Email",

        emailPlaceholder:
            "Enter your email",

        password:
            "Password",

        passwordPlaceholder:
            "Enter your password",

        signingIn:
            "Signing in...",

        loginError:
            "Unable to sign in.",

        invalidCredentials:
            "Incorrect email or password.",

        accountLocked:
            "This account is temporarily locked. Please try again later.",

        accountInactive:
            "This account is inactive. Please contact the administrator.",
    },

    system: {
        accessDenied:
            "Access denied",

        accessDeniedDescription:
            "Your account does not have access to this area.",

        returnHome:
            "Return Home",

        pageNotFound:
            "Page not found",

        pageNotFoundDescription:
            "The requested page does not exist.",
    },

    dashboard: {
        overview:
            "Overview",

        title:
            "Dashboard",

        description:
            "Overview of elections, voting activity and internal system usage.",

        loading:
            "Loading dashboard...",

        unavailable:
            "Dashboard unavailable",

        loadError:
            "Unable to load dashboard information.",

        updated:
            "Updated {{date}}",

        elections:
            "Elections",

        liveElections:
            "{{count}} live",

        internalUsers:
            "Internal Users",

        activeUsers:
            "{{count}} active",

        totalBallots:
            "Total Ballots",

        allElections:
            "Across all elections",

        closedElections:
            "Closed Elections",

        scheduledElections:
            "{{count}} scheduled",

        focusElection:
            "Focus Election",

        expectedVoters:
            "Expected Voters",

        ballotsCast:
            "Ballots Cast",

        turnout:
            "Turnout",

        candidates:
            "Candidates",

        recentActivity:
            "Recent Activity",

        recentActivityDescription:
            "Latest recorded administrative activity.",

        noActivity:
            "No recent activity.",

        internalUser:
            "Internal user",
    },
    elections: {
        management:
            "Election Management",

        title:
            "Elections",

        description:
            "Create, configure and manage CASA voting events.",

        createElection:
            "Create Election",

        createDescription:
            "Create the election configuration first. Candidates and scheduling can be configured afterward.",

        loading:
            "Loading elections...",

        loadError:
            "Unable to load elections.",

        noElections:
            "No elections found",

        noElectionsDescription:
            "There are no elections matching the selected status.",

        count:
            "{{count}} election(s)",

        election:
            "Election",

        expectedVoters:
            "Expected Voters",

        votingRule:
            "Voting Rule",

        schedule:
            "Schedule",

        notScheduled:
            "Not scheduled",

        to:
            "to",

        selectExact:
            "Select {{count}}",

        selectRange:
            "Select {{min}} – {{max}}",

        generalInformation:
            "Election Information",

        generalInformationDescription:
            "Enter the basic information for this election.",

        electionTitle:
            "Election Title",

        electionTitlePlaceholder:
            "Enter election title",

        electionDescription:
            "Description",

        electionDescriptionPlaceholder:
            "Enter an optional election description",

        resultVisibility:
            "Result Visibility",

        visibilityLive:
            "Live",

        visibilityAfterClose:
            "After Election Closes",

        visibilityHidden:
            "Hidden",

        votingRules:
            "Voting Rules",

        votingRulesDescription:
            "Configure how voters may submit their ballots.",

        minimumSelections:
            "Minimum Selections",

        maximumSelections:
            "Maximum Selections",

        oneVotePerDevice:
            "One Vote Per Device",

        oneVotePerDeviceDescription:
            "Required by the CASA Voting System.",

        allowBlankBallot:
            "Allow Blank Ballot",

        allowBlankBallotDescription:
            "Permit voters to submit without selecting a candidate.",

        invalidSelectionRange:
            "Maximum selections must be greater than or equal to minimum selections.",

        titleRequired:
            "Election title is required.",

        creating:
            "Creating...",

        createError:
            "Unable to create election.",

        missingElectionId:
        "Election ID is missing.",

        notFound:
        "Election not found.",

        unavailable:
        "Election unavailable",

        loadElectionError:
        "Unable to load this election.",

        loadingElection:
        "Loading election...",

        backToElections:
        "Back to Elections",

        noDescription:
        "No description provided.",

        configuration:
        "Election Configuration",

        configurationDescription:
        "Current voting configuration and restrictions.",

        timing:
        "Election Timing",

        timingDescription:
        "Schedule and lifecycle timing information.",

        start:
        "Start",

        end:
        "End",

        startType:
        "Start Type",

        closeType:
        "Close Type",

        closeReason:
        "Close Reason",

        startManual:
        "Manual",

        startAutomatic:
        "Automatic Timer",

        closeManual:
        "Manual",

        closeAutomatic:
        "Automatic Timer",

        closeEmergency:
        "Emergency",
        
        resultVisibilityDescription:
        "Choose when election results are visible to the public.",

        saveResultVisibility:
        "Save",

        savingResultVisibility:
        "Saving...",

        resultVisibilityUpdated:
        "Result visibility updated successfully.",

        resultVisibilityUpdateError:
        "Unable to update result visibility.",

        resultVisibilityLocked:
        "Result visibility is locked after the election is closed.",
    },

    candidates: {
        title:
            "Candidates",

        description:
            "Manage the candidates participating in this election.",

        lockedDescription:
            "Candidate information is locked for the current election state.",

        addCandidate:
            "Add Candidate",

        editCandidate:
            "Edit Candidate",

        updateCandidate:
            "Update Candidate",

        loading:
            "Loading candidates...",

        loadError:
            "Unable to load candidates.",

        actionError:
            "Candidate action failed.",

        deleteError:
            "Unable to delete candidate.",

        saveError:
            "Unable to save candidate.",

        noCandidates:
            "No candidates added",

        noCandidatesDescription:
            "Add the first candidate to prepare this election.",

        number:
            "Candidate Number",

        candidate:
            "Candidate",

        from: "From",

        displayOrder:
            "Display Order",

        nameTitle:
            "Title",

        titlePlaceholder:
            "Mr., Ms., Dr., etc.",

        firstName:
            "First Name",

        lastName:
            "Last Name",

        descriptionLabel:
            "Description",

        imageUrl:
            "Image URL",

        activeCandidate:
            "Active Candidate",

        activeCandidateDescription:
            "Include this candidate in election readiness and voting.",

        activate:
            "Activate",

        deactivate:
            "Deactivate",

        saving:
            "Saving...",

        formDescription:
            "Enter the candidate information displayed to election administrators and voters.",

        deleteConfirm:
            "Delete candidate #{{number}} {{name}}?",
    },
    readiness: {
        title:
            "Election Readiness",

        description:
            "Check whether this election is ready to proceed.",

        loading:
            "Checking election readiness...",

        unavailable:
            "Readiness information is unavailable.",

        ready:
            "Ready",

        notReady:
            "Not Ready",

        activeCandidates:
            "Active Candidates",

        minimumSelections:
            "Minimum Selections",

        maximumSelections:
            "Maximum Selections",

        issues:
            "Issues requiring attention",

        noIssues:
            "No readiness issues were found.",
    },
    lifecycle: {
        title:
            "Election Lifecycle",

        description:
            "Schedule, start, close and archive this election.",

        created:
            "Created",

        scheduled:
            "Scheduled",

        started:
            "Started",

        closed:
            "Closed",

        archived:
            "Archived",

        schedule:
            "Schedule Election",

        scheduleDescription:
            "Set the planned start and end date and time.",

        startAt:
            "Start Date / Time",

        endAt:
            "End Date / Time",

        start:
            "Start Election",

        startDescription:
            "Start accepting ballots for this election.",

        close:
            "Close Election",

        closeDescription:
            "Stop accepting new ballots and close the election normally.",

        emergencyClose:
            "Emergency Close",

        emergencyDescription:
            "Immediately close the election and record the reason.",

        emergencyReason:
            "Emergency Close Reason",

        emergencyPlaceholder:
            "Explain why the election must be closed immediately...",

        archive:
            "Archive Election",

        archiveDescription:
            "Archive the closed election and freeze its lifecycle state.",

        archivedTitle:
            "Election Archived",

        archivedDescription:
            "This election is archived and its lifecycle is frozen.",

        scheduleRequired:
            "Start and end date/time are required.",

        invalidDate:
            "Enter a valid start and end date/time.",

        endAfterStart:
            "End date/time must be later than start date/time.",

        notReady:
            "Resolve the election readiness issues before continuing.",

        processing:
            "Processing...",

        scheduleSuccess:
            "Election scheduled successfully.",

        scheduleError:
            "Unable to schedule election.",

        startConfirm:
            "Start this election now?",

        startSuccess:
            "Election started successfully.",

        startError:
            "Unable to start election.",

        closeConfirm:
            "Close this election? New ballots will no longer be accepted.",

        closeSuccess:
            "Election closed successfully.",

        closeError:
            "Unable to close election.",

        emergencyReasonMinimum:
            "Emergency close reason must contain at least 5 characters.",

        emergencyReasonMaximum:
            "Emergency close reason cannot exceed 1000 characters.",

        emergencyConfirm:
            "Emergency close this election now?",

        emergencySuccess:
            "Election emergency-closed successfully.",

        emergencyError:
            "Unable to emergency close election.",

        archiveConfirm:
            "Archive this election? The election lifecycle will be frozen.",

        archiveSuccess:
            "Election archived successfully.",

        archiveError:
            "Unable to archive election.",
    },

    home: {
        eyebrow:
            "Secure Election Platform",

        title:
            "Voting System",

        description:
            "Participate in the election system organized by CASA, which is operating safely, and view the results in accordance with the election conditions.",

        secureVoting:
            "Secure Voting",

        voting:
            "Voting",

        activeElections:
            "Active Elections",

        activeCount:
            "{{count}} active election(s)",

        loading:
            "Loading elections...",

        loadError:
            "Unable to load elections.",

        noActiveElection:
            "No active elections",

        noActiveDescription:
            "There are currently no elections available for voting.",

        defaultElectionDescription:
            "Participate in this CASA election.",

        expectedVoters:
            "{{count}} expected voters",

        selectExact:
            "Select {{count}} candidate(s)",

        selectRange:
            "Select {{min}} – {{max}} candidates",

        ends:
            "Ends {{date}}",

        voteNow:
            "Vote Now",

        viewResults:
            "View Results",
    },
    publicVoting: {
        preparing:
            "Preparing voting page...",

        unavailable:
            "Election unavailable",

        electionNotFound:
            "Unable to find this election.",

        missingElectionId:
            "Election ID is missing.",

        loadError:
            "Unable to load the voting page.",

        backHome:
            "Back to Home",

        liveElection:
            "Voting is currently open",

        votingRules:
            "Voting Rules",

        selectExact:
            "Select exactly {{count}} candidate(s).",

        selectRange:
            "Select between {{min}} and {{max}} candidates.",

        blankAllowed:
            "Blank ballot allowed",

        candidateNumber:
            "Candidate #{{number}}",

        maximumSelectionError:
            "You can select a maximum of {{count}} candidate(s).",

        noCandidates:
            "No candidates are available.",

        submitBlankBallot:
            "Blank Ballot",

        blankDescription:
            "Submit your ballot without selecting a candidate.",

        selectedCount:
            "{{count}} candidate(s) selected",

        reviewBeforeSubmit:
            "Review your selection before submitting.",

        submitVote:
            "Submit Vote",

        submitting:
            "Submitting...",

        confirmMessage:
            "Submit this ballot? Your vote cannot be changed after submission.",

        confirmBlankMessage:
            "Submit a blank ballot? Your vote cannot be changed after submission.",

        submitError:
            "Unable to submit your vote.",

        alreadyVoted:
            "This device has already voted.",

        electionClosed:
            "Voting is no longer available for this election.",

        votingStatus:
            "Voting Status",

        thankYou:
            "Thank You",

        successMessage:
            "Your ballot has been recorded successfully.",

        alreadyVotedMessage:
            "A ballot has already been recorded from this device.",

        submittedAt:
            "Submitted {{date}}",
    },
    publicResults: {
        title:
            "Election Results",

        liveResults:
            "Live Results",

        loading:
            "Loading results...",

        refreshing:
            "Refreshing...",

        refresh:
            "Refresh",

        updatedAt:
            "Updated {{date}}",

        missingElectionId:
            "Election ID is missing.",

        electionNotFound:
            "Election not found.",

        loadError:
            "Unable to load election results.",

        unavailable:
            "Results unavailable",

        displayError:
            "Unable to display these results.",

        notAvailableYet:
            "Results Not Available Yet",

        notPublicYet:
            "Results are not currently available to the public.",

        turnout:
            "Turnout",

        turnoutDetail:
            "{{ballots}} / {{expected}} voters",

        ballotsCast:
            "Ballots Cast",

        nonBlankDetail:
            "{{count}} non-blank ballots",

        blankBallots:
            "Blank Ballots",

        blankDetail:
            "Accepted blank ballots",

        candidateSelections:
            "Candidate Selections",

        selectionDetail:
            "Total selections across ballots",

        currentLeader:
            "Current Leader",

        ranking:
            "Ranking",

        candidateResults:
            "Candidate Results",

        candidateCount:
            "{{count}} candidate(s)",

        noCandidates:
            "No candidate results are available.",

        candidateNumber:
            "Candidate #{{number}}",

        voteCount:
            "{{count}} vote(s)",

        ofBallots:
            "from {{count}} ballot(s)",

        ballotPercentageShort:
            "Ballot %",

        selectionShare:
            "Selection share",

        aboutPercentages:
            "About the Percentages",

        ballotPercentage:
            "Ballot Percentage:",

        ballotPercentageExplanation:
            "the percentage of submitted ballots that selected this candidate.",

        selectionPercentage:
            "Selection Percentage:",

        selectionPercentageExplanation:
            "the candidate's share of all candidate selections.",

        multipleSelectionNote:
            "When voters may select more than one candidate, selection percentages and ballot percentages represent different measures.",

        backHome:
            "Back to Home",

        backElections:
            "Back to Elections",
    },
    adminResults: {
        management:
            "Results Management",

        title:
            "Results",

        description:
            "Review election results and export official result reports.",

        loading:
            "Loading elections...",

        loadError:
            "Unable to load elections.",

        noElections:
            "No elections found",

        noElectionsDescription:
            "There are no elections available for result review.",

        election:
            "Election",

        resultVisibility:
            "Public Visibility",

        expectedVoters:
            "Expected Voters",

        lastUpdated:
            "Last Updated",

        viewResults:
            "View Results",

        electionResults:
            "Election Results",

        resultDescription:
            "Detailed administrative election result summary.",

        loadingResults:
            "Loading election results...",

        loadResultError:
            "Unable to load election results.",

        resultsUnavailable:
            "Results unavailable",

        missingElectionId:
            "Election ID is missing.",

        backResults:
            "Back to Results",

        calculatedAt:
            "Calculated {{date}}",

        refreshing:
            "Refreshing...",

        turnout:
            "Turnout",

        turnoutDetail:
            "{{ballots}} / {{expected}} voters",

        totalBallots:
            "Total Ballots",

        nonBlankBallots:
            "{{count}} non-blank",

        blankBallots:
            "Blank Ballots",

        blankBallotDetail:
            "Accepted blank ballots",

        selections:
            "Candidate Selections",

        selectionDetail:
            "Selections across all ballots",

        exportTitle:
            "Export Results",

        exportDescription:
            "Download the official election result data in Excel or PDF format.",

        exportExcel:
            "Export Excel",

        exportPdf:
            "Export PDF",

        exporting:
            "Exporting...",

        exportError:
            "Unable to export results.",

        ranking:
            "Ranking",

        candidateResults:
            "Candidate Results",

        candidateCount:
            "{{count}} candidate(s)",

        noCandidateResults:
            "No candidate results are available.",

        candidateNumber:
            "Candidate #{{number}}",

        ballotPercentage:
            "Ballot Percentage",

        selectionPercentage:
            "Selection share: {{percentage}}%",

        votes:
            "Votes",

        pdfUnderDevelopment:
            "PDF export is currently under development. Please use Excel export for now.",

        exportRawJson:
            "Download Raw Votes",
    },
    users: {
        management:
            "User Management",

        title:
            "Users",

        description:
            "Manage internal CASA user and administrator accounts.",

        createUser:
            "Create User",

        editUser:
            "Edit User",

        createDescription:
            "Create a new internal account. Permissions can be assigned afterward.",

        editDescription:
            "Update the account name, email address or role.",

        fullName:
            "Full Name",

        email:
            "Email",

        password:
            "Password",

        newPassword:
            "New Password",

        confirmPassword:
            "Confirm New Password",

        passwordHelp:
            "Password must contain between 8 and 128 characters.",

        role:
            "Role",

        permissions:
            "Permissions",

        permissionLaterNote:
            "After creating the account, use Permission Management to control exactly what this user can access.",

        saving:
            "Saving...",

        saveChanges:
            "Save Changes",

        loading:
            "Loading users...",

        loadError:
            "Unable to load users.",

        createError:
            "Unable to create user.",

        updateError:
            "Unable to update user.",

        actionError:
            "Unable to complete the user action.",

        createSuccess:
            "{{name}} was created successfully.",

        updateSuccess:
            "{{name}} was updated successfully.",

        searchPlaceholder:
            "Search by name or email...",

        resultCount:
            "{{filtered}} of {{total}} user(s)",

        account:
            "Account",

        lastLogin:
            "Last Login",

        currentAccount:
            "Current account",

        neverLoggedIn:
            "Never",

        allPermissions:
            "All permissions",

        permissionCount:
            "{{count}} permission(s)",

        activate:
            "Activate",

        deactivate:
            "Deactivate",

        activateSuccess:
            "{{name}} was activated.",

        deactivateSuccess:
            "{{name}} was deactivated.",

        deactivateConfirm:
            "Deactivate {{name}}?",

        deleteConfirm:
            "Delete {{name}}? This action cannot be undone.",

        deleteSuccess:
            "{{name}} was deleted.",

        cannotDeactivateSelf:
            "You cannot deactivate your own account.",

        cannotDeleteSelf:
            "You cannot delete your own account.",

        resetPassword:
            "Reset Password",

        resetting:
            "Resetting...",

        resetPasswordError:
            "Unable to reset the password.",

        resetPasswordSuccess:
            "Password for {{name}} was reset successfully.",

        passwordMinimum:
            "Password must contain at least 8 characters.",

        passwordMaximum:
            "Password cannot exceed 128 characters.",

        passwordMismatch:
            "The password confirmation does not match.",

        nameMinimum:
            "Full name must contain at least 2 characters.",

        emailRequired:
            "Email address is required.",

        noUsers:
            "No users found",

        noUsersDescription:
            "No accounts match the current search and filters.",
    },
    permissions: {
        manage:
            "Manage Permissions",

        title:
            "Permission Management",

        description:
            "Control which administrative functions this account can access.",

        selectedCount:
            "{{selected}} of {{total}} permissions selected",

        groupCount:
            "{{selected}} / {{total}} selected",

        selectAll:
            "Select All",

        clearAll:
            "Clear All",

        selectGroup:
            "Select Group",

        groupSelected:
            "Selected",

        save:
            "Save Permissions",

        saving:
            "Saving...",

        saveError:
            "Unable to update user permissions.",

        saveSuccess:
            "Permissions for {{name}} were updated successfully.",

        superAdminTitle:
            "Full System Access",

        superAdminDescription:
            "Super Admin accounts have access to all system functions automatically. Individual permissions do not need to be assigned.",
    },
    permissionGroups: {
        dashboard:
            "Dashboard",

        elections:
            "Elections",

        candidates:
            "Candidates",

        results:
            "Results",

        users:
            "Users",

        system:
            "System & Reporting",
    },
    permissionLabels: {
        dashboardView:
            "View Dashboard",

        electionsView:
            "View Elections",

        electionsCreate:
            "Create Elections",

        electionsUpdate:
            "Update Elections",

        electionsDelete:
            "Delete Elections",

        electionsSchedule:
            "Schedule Elections",

        electionsStart:
            "Start Elections",

        electionsClose:
            "Close Elections",

        electionsEmergencyClose:
            "Emergency Close",

        electionsArchive:
            "Archive Elections",

        candidatesView:
            "View Candidates",

        candidatesCreate:
            "Create Candidates",

        candidatesUpdate:
            "Update Candidates",

        candidatesDelete:
            "Delete Candidates",

        resultsView:
            "View Results",

        resultsExport:
            "Export Results",

        usersView:
            "View Users",

        usersCreate:
            "Create Users",

        usersUpdate:
            "Update Users",

        usersActivate:
            "Activate Users",

        usersDeactivate:
            "Deactivate Users",

        usersDelete:
            "Delete Users",

        usersResetPassword:
            "Reset Passwords",

        permissionsManage:
            "Manage Permissions",

        auditLogsView:
            "View Audit Logs",

        reportsExport:
            "Export Reports",
    },
    permissionDescriptions: {
        dashboardView:
            "Access the administration dashboard.",

        electionsView:
            "View election information.",

        electionsCreate:
            "Create new elections.",

        electionsUpdate:
            "Modify election configuration.",

        electionsDelete:
            "Delete eligible elections.",

        electionsSchedule:
            "Set election start and end times.",

        electionsStart:
            "Manually start scheduled elections.",

        electionsClose:
            "Normally close live elections.",

        electionsEmergencyClose:
            "Immediately close live elections with a reason.",

        electionsArchive:
            "Archive closed elections.",

        candidatesView:
            "View election candidates.",

        candidatesCreate:
            "Add candidates to elections.",

        candidatesUpdate:
            "Modify candidate information.",

        candidatesDelete:
            "Delete eligible candidates.",

        resultsView:
            "View administrative election results.",

        resultsExport:
            "Download election results as Excel or PDF.",

        usersView:
            "View internal accounts.",

        usersCreate:
            "Create internal accounts.",

        usersUpdate:
            "Modify account information and roles.",

        usersActivate:
            "Activate inactive accounts.",

        usersDeactivate:
            "Deactivate active accounts.",

        usersDelete:
            "Delete eligible accounts.",

        usersResetPassword:
            "Set a new password for another account.",

        permissionsManage:
            "Assign and change user permissions.",

        auditLogsView:
            "Review administrative audit history.",

        reportsExport:
            "Export system reports.",
    },
    audit: {
        management:
            "System Monitoring",

        title:
            "Audit Logs",

        description:
            "Review administrative and internal user activity recorded by the system.",

        loading:
            "Loading audit logs...",

        loadError:
            "Unable to load audit logs.",

        searchPlaceholder:
            "Search audit activity...",

        actor:
            "Actor",

        actorName:
            "Actor Name",

        actorEmail:
            "Actor Email",

        actorRole:
            "Actor Role",

        actorId:
            "Actor ID",

        action:
            "Action",

        resource:
            "Resource",

        resourceType:
            "Resource Type",

        resourceId:
            "Resource ID",

        request:
            "Request",

        time:
            "Time",

        fromDate:
            "From",

        toDate:
            "To",

        clearFilters:
            "Clear Filters",

        viewDetails:
            "Details",

        detailTitle:
            "Audit Entry Details",

        ipAddress:
            "IP Address",

        userAgent:
            "User Agent",

        details:
            "Recorded Details",

        noDetails:
            "No additional details were recorded for this activity.",

        noLogs:
            "No audit logs found",

        noLogsDescription:
            "No recorded activity matches the current filters.",

        paginationSummary:
            "Page {{page}} of {{pages}} · {{total}} total records",
    },
    auditActions: {
        user_login:
            "User Login",

        user_logout:
            "User Logout",

        user_created:
            "User Created",

        user_updated:
            "User Updated",

        user_activated:
            "User Activated",

        user_deactivated:
            "User Deactivated",

        user_deleted:
            "User Deleted",

        user_password_reset:
            "Password Reset",

        permission_updated:
            "Permissions Updated",

        election_created:
            "Election Created",

        election_updated:
            "Election Updated",

        election_deleted:
            "Election Deleted",

        election_scheduled:
            "Election Scheduled",

        election_started:
            "Election Started",

        election_closed:
            "Election Closed",

        election_emergency_closed:
            "Emergency Close",

        election_archived:
            "Election Archived",

        candidate_created:
            "Candidate Created",

        candidate_updated:
            "Candidate Updated",

        candidate_deleted:
            "Candidate Deleted",

        result_viewed:
            "Results Viewed",

        result_exported_excel:
            "Excel Exported",

        result_exported_pdf:
            "PDF Exported",
    },
    auditResources: {
        user:
            "User",

        election:
            "Election",

        candidate:
            "Candidate",

        result:
            "Result",

        report:
            "Report",

        permission:
            "Permission",
    },
    corrections: {
        superAdmin:
            "Super Admin",

        title:
            "Vote Corrections",

        liveElection:
        "Live Election",

        noLiveElections:
        "No live elections",

        noLiveDescription:
        "Votes can only be edited while an election is live.",

        loadElectionsError:
        "Unable to load live elections.",

        description:
        "Review and update ballot selections while an election is live.",

        searchVote:
            "Search by vote ID...",

        voteCount:
            "{{count}} vote(s)",

        loading:
            "Loading votes...",

        loadVotesError:
            "Unable to load votes.",

        noVotes:
            "No votes found",

        noVotesDescription:
            "No votes match the current search.",

        voteId:
            "Vote ID",

        voteTime:
            "Vote Date / Time",

        currentSelection:
            "Current Selection",

        edit:
            "Edit",

        editVote:
            "Edit Vote",

        changeSelection:
            "Change Selection",

        selectExact:
            "Select exactly {{count}} candidate(s).",

        selectRange:
            "Select between {{min}} and {{max}} candidate(s).",

        candidateNumber:
            "Candidate #{{number}}",

        blankBallot:
            "Blank Ballot",

        blankBallotDescription:
            "Change this vote to a blank ballot.",

        minimumSelections:
            "Select at least {{count}} candidate(s).",

        maximumSelections:
            "You can select a maximum of {{count}} candidate(s).",

        noChange:
            "No changes were made to this vote.",

        confirmCorrection:
            "Save this change to the vote?",

        saveChange:
            "Save Change",

        saving:
            "Saving...",

        saveError:
            "Unable to update the vote.",

        saveSuccess:
            "Vote updated successfully.",
    },
    publicShare: {
        title: "Public Voting Link",
        liveDescription:
            "Share this link or QR code with voters to access the live election.",
        scheduledDescription:
            "You can prepare and share this link before voting begins. Voting will become available when the election is live.",
        publicLink: "Public link",
        copyLink: "Copy Link",
        copied: "Copied",
        share: "Share",
        open: "Open Voting Page",
        downloadQr: "Download QR Code",
        copyError:
            "Unable to copy the voting link.",
        shareTitle: "CASA Voting System",
        shareText:
            "Open the CASA Voting System to cast your vote.",
    },
  },
};

export default en;