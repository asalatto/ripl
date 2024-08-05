# Waymark App

This is a simple React app that points you toward lucrative industries to break into based on your education level, desired salary, and sector interests. It's built using [2023 National Occupational Employment and Wage estimates](https://www.bls.gov/oes/current/oes_nat.htm), as well as [Entry level educational requirement](https://www.bls.gov/oes/additional.htm) datasets.

To start the project, run `npm start` in the project root and navigate to [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Process

This app gives users an easy way to find out: what industries require the highest levels of education, whether those jobs give you more bang for your buck when it comes to advanced degrees, and what their career options are based on their level of schooling.

### User Types

To get a sense of how I could make a useful app using the OEWS data, I envisioned three main types of potential users. These user profiles helped me establish the major functionalities I needed for this app, and which fields would be most useful to filter the data.

- A **student (non-degree)** wondering about their career path might want to see what industries and jobs offer the best ROI for higher education.
    - Example user story: I’m looking for the highest-paying jobs I can apply for with a high school diploma, or associate’s degree, etc.
        - I need to be able to enter my education level and see the highest paying jobs available to me across any industry or sector.
        - Then I want to be able to narrow down my search and filter out results that are not interesting or applicable to me.
    - Requirements:
        - Education field
        - Sort by avg salary
        - Filter by sector/industries

- A **new graduate** might want to see what’s available in their chosen sector with their degree.
    - Example user story: I’m searching based on sector (ie Healthcare) and education (ie Bachelor’s degree) to determine what job path in my overall sector I should focus on.
        - I need to be able to enter my education level and the sector I’m going to work in to see the various industry options within that sector.
        - Then I want to be able to narrow down my search and filter out results that are not interesting or applicable to me.
        - I also want to be able to change my education level to see what careers in my sector I could get if I had a more advanced degree, and whether that’s worth it.
    - Requirements:
        - Education field
        - Filter by sector/industry

- A **career changer** might want to explore industries with lower barriers of entry.
    - Example user story: Though I have a degree and professional experience, I want to see which jobs in my desired sector are easiest to break into (lowest education requirement) to gain industry-specific experience.
        - I need to be able to compare entry level salaries across different sectors.
        - Then, I want to drill down into my sectors of interest to explore realistic points of entry that will not be too much of a salary cut.
    - Requirements:
        - See all sectors/jobs at once, then filter
        - Sort by avg salary (highest to lowest)
        - Minimum salary field (min/max)

These are some examples of answers/data points that I wanted the app to be able to quickly provide:
- Which jobs pay the most for the least amount of education?
- Which jobs pay the least for the most amount of education? (NOTE: This would come in a future version which allows for results sorting; currently, the results are displayed from highest to lowest median salary)
- Which industries are most accessible to those without a college degree?
- What’s the easiest job to get in *x* sector?
- If I switch careers, which sectors/industries will let me make at least as much as I’m making now right off the bat?


### User Flow

Based on the potential types of users above, I envisioned what steps the user might take to get results in the app. For example:

1. Enter education level, click next.
2. Enter minimum salary requirements, or skip.
3. Select sectors of interest (all checked by default) or skip.
4. See results!
    - Option to restart the questionnaire in top right
    - Option to edit your options in sentence form: “Showing highest paying jobs you can get with a bachelor’s degree.”
    - Sidebar lets you select/deselect certain industries and jobs from results.
    - “Show more” option

I established the first four steps as required for a MVP, and additional functionalities on the results page will come in future versions.

## Final Notes

Although additional features can be added to make the app more useful, the requirements for a MVP product were achieved. I prioritized ease of use for all user types (with accessibility in mind) and design flexibility. 

Another note on data: I imported the 2023 data as JS consts for ease of building this product, rather than mocking API requests (which are not available from the Bureau of Labor Statistics website). In a future version, I would mock these requests so that data could easily be swapped out for more recent datasets in the future.
