import React from 'react';
import './App.scss';
import { SECTORS_DATA, SectorFields } from './data/sectors';
import { INDUSTRIES_DATA, IndustryFields } from './data/industries';
import { EDUCATION_DATA, EducationFields } from './data/education';
import Screen from './components/Screen';

function App() {

    interface SearchFields {
        education:  null|string,
        min_salary: null|string,
        sectors:    null|Object[];
    }

    /* State */

    // All start as null to indicate fields were neither filled out or skipped yet
    const initialSearch: SearchFields = {
        education:  null,
        min_salary: null,
        sectors:    null,
    };

    const [screen, setScreen] = React.useState<number>(1);
    const [search, setSearch] = React.useState<SearchFields>(initialSearch);
    const [results, setResults] = React.useState<IndustryFields[]>([]);

    const educationInput = React.useRef<HTMLSelectElement>(null);
    const minimumInput = React.useRef<HTMLInputElement>(null);
    const sectorsInput = React.useRef<HTMLFieldSetElement>(null);

    /* Get data from form */
    const setEducation = (e: Event) => {
        e.preventDefault();
        setSearch({...search, education: educationInput?.current?.value ?? ''})
        setScreen(2);
    }

    const setMinimum = (e: Event) => {
        e.preventDefault();
        setSearch({...search, min_salary: minimumInput?.current?.value ?? ''})
        setScreen(3);
    }

    const setSectors = (e: Event) => {
        e.preventDefault();
        const inputs = sectorsInput?.current?.querySelectorAll<HTMLInputElement>('input[name="sector"]');
        // const inputs = Array.from(sectorsInput.current.querySelectorAll('input[name="sector"]'));
        if (inputs) {
            const checked = Array.from(inputs).filter(c => c.checked);
            setSearch({...search, sectors: checked.map(c => c.value)})
        }
    }

    // Get list of industries based on NAICS sector codes
    const getIndustriesByNaics = (industries: IndustryFields[], naics: string[]) => {
        let results: IndustryFields[] = [];
        naics.forEach(code => {
            const matches = industries.filter(x => x.naics.startsWith(code));
            results = [...results, ...matches];
        })
        return results;
    }

    const isSalaryAboveBase = (base: string, salary: string) => {
        const base_num = parseInt(base);
        let salary_num;
        if (salary.includes(',')) {
            salary_num = parseInt(salary.replaceAll(',', ''));
        } else {
            salary_num = parseInt(salary);
        }
        return (salary_num >= base_num);
    }


    /* Data filtering */

    // Get list of NAICS codes; some sectors have single numbers ('11') and some have ranges ('31-33')
    const getNaicsByName = (sectors: SectorFields[]) => {
        const naics: string[] = [];
        const matching_sectors = sectors.filter(x => search?.sectors?.includes(x.naics_name));
        const matching_naics = [...new Set(matching_sectors.map(s => s.naics))];
        matching_naics.forEach(code => {
            if (code.includes('-')) {
                const min = parseInt(code.split('-')[0]);
                const max = parseInt(code.split('-')[1]);
                for (let i = min; i <= max; i++) {
                    naics.push(i.toString());
                }
            } else {
                naics.push(code);
            }
        })
        return naics;
    }


    React.useEffect(() => {
        if (Object.values(search).every(x => x !== null) && results.length === 0) {
            let dataset = INDUSTRIES_DATA as IndustryFields[];

            // Filter by education level
            if (search.education !== null && search.education.length > 0) {
                const filtered_by_education = dataset.filter(x => x.education_category === search.education);
                dataset = filtered_by_education;
            }

            // Filter by sector
            if (search.sectors !== null && search.sectors.length > 0) {
                const searched_sectors = getNaicsByName(SECTORS_DATA as SectorFields[]);
                const filtered_by_industry = getIndustriesByNaics(dataset, searched_sectors);
                dataset = filtered_by_industry;
            }

            // Filter by minimum salary
            if (search.min_salary !== null && search.min_salary.length > 0) {
                const filtered_by_salary = dataset.filter(x => {
                    return isSalaryAboveBase(search.min_salary as string, x.a_median as string)
                });
                dataset = filtered_by_salary;
            }
            
            const sorted: IndustryFields[] = dataset.sort((a: IndustryFields, b: IndustryFields) => {
                const aNum = parseInt((a.a_median as string).replaceAll(',', ''));
                const bNum = parseInt((b.a_median as string).replaceAll(',', ''));
                if (aNum < bNum) {
                    return 1;
                }
                if (aNum > bNum) {
                    return -1;
                }
                return 0;
            });
            
            if (sorted.length > 0) {
                setResults(sorted);
            }
        }
    }, [search, results]);

    return (
        <main className="App">
            <header>
                <h1><a href="/">Waymark</a></h1>
                { results.length === 0 &&
                    <p>Explore career paths available to you right now, no matter how much schooling you have. Answer the questions below, or skip them to see industry results.</p>
                }
            </header>

            { Object.values(search).includes(null) ?
                <div className="questions">
                    <Screen
                        submitFunction={setEducation}
                        screenOrder={1}
                        currentScreen={screen}
                        aria-hidden={screen !== 3}
                    >
                        <div className="flex-container">
                            <p>
                                My <label htmlFor="input-education-level">highest level of education</label> is
                                <select 
                                    id="input-education-level"
                                    className="input"
                                    name="education"
                                    defaultValue=""
                                    ref={educationInput}
                                    tabIndex={screen === 1 ? 0 : -1}
                                >
                                    <option disabled value="">Select one</option>
                                    {
                                        [...EDUCATION_DATA].reverse().map((lvl: EducationFields) => {
                                            return <option key={lvl.education_category}>{lvl.education_category}</option>
                                        })
                                    }
                                </select>
                            </p>
                        </div>
                    </Screen>

                    <Screen
                        submitFunction={setMinimum}
                        screenOrder={2}
                        currentScreen={screen}
                        aria-hidden={screen !== 3}
                    >
                        <div className="flex-container">
                            <p>
                                I want my <label htmlFor="input-minimum-salary">minimum yearly salary</label> to be 
                                <input 
                                    id="input-minimum-salary"
                                    className="input"
                                    name="minimum_salary"
                                    type="number" 
                                    placeholder="Whole number with no commas"
                                    defaultValue=""
                                    ref={minimumInput}
                                    tabIndex={screen === 2 ? 0 : -1}
                                />
                            </p>
                        </div>
                    </Screen>

                    <Screen
                        submitFunction={setSectors}
                        screenOrder={3}
                        currentScreen={screen}
                        aria-hidden={screen !== 3}
                    >
                        <p>
                            I'm interested in these sectors:
                            <a className="skip-link" href="#button-3">Skip &rarr;</a>
                        </p>
                        <fieldset ref={sectorsInput}>
                            {
                                [...new Set(SECTORS_DATA.map((s: SectorFields) => s.naics_name))].sort().map(s => {
                                    return (
                                        <label className="sector-label" key={s}>
                                            <input type="checkbox" name="sector" value={s} tabIndex={screen === 3 ? 0 : -1} /> {s}
                                        </label>
                                    )
                                })
                            }
                        </fieldset>
                    </Screen>
                </div>
            :
                <>
                    { results.length === 0 ?
                        <h2>No results match your criteria! Try <a href="/">starting over and broadening your search</a>.</h2>
                    :
                        <div className="results">
                            <h2>The top {results.length <= 10 ? results.length : 10} highest-paying industries available to you are...</h2>
                            <ol className="results-list">
                                {results.slice(0,9).map((res: IndustryFields) => {
                                    return (
                                        <li key={`${res.naics_name}_${res.education_category}`}>
                                            <div>
                                                <header>
                                                    <h3>${res.a_median} &mdash; {res.naics_name}</h3>
                                                    <a 
                                                        className="learn-more-button"
                                                        href={`https://www.bls.gov/oes/2023/may/naics4_${res.naics}.htm`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title={`Learn more about the ${ res.naics_name } industry on the US Bureau of Labor Statistics website`}
                                                    >Learn more</a>
                                                </header>
                                                {search?.education?.length === 0 && <p>(This salary is for the {res.education_category} education level.)</p>}
                                                This industry has around <strong>{ res.tot_emp }</strong> employees working at this level nationally. 
                                                { res.a_pct25 !== '#' && res.a_pct75 !== '#' && ` Salaries typically range from $${ res.a_pct25 } to $${ res.a_pct75 }.` }
                                            </div>
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>
                    }
                    <footer>
                        <p>Built by <a href="https://github.com/asalatto" target="_blank" rel="noreferrer">Anna Salatto</a></p>
                        <p>Data from US Bureau of Labor Statistics <a href="https://www.bls.gov/oes/current/oes_nat.htm" target="_blank" rel="noreferrer">May 2023 National Occupational Employment and Wage Estimates </a> and <a href="https://www.bls.gov/oes/additional.htm" target="_blank" rel="noreferrer">Entry level educational requirement</a> datasets.</p>
                    </footer>
                </>
            }
        </main>
    );
}

export default App;
