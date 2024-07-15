import './index.scss';


interface FieldProps {
    submitFunction: Function;
    screenOrder:    number;
    currentScreen:  number;
    children?:      React.ReactNode;
}

export default function Screen({
    submitFunction,
    screenOrder,
    currentScreen,
    children
}: FieldProps) {
    
    const screenStatus = screenOrder === currentScreen ? 'active' : currentScreen > screenOrder ? 'done' : '';

    return (
        <div className={`screen ${screenStatus}`}>
            <form id={`form-${screenOrder}`}>
                {children}
                <button 
                    type="submit" 
                    id={`button-${screenOrder}`}
                    form={`form-${screenOrder}`}
                    onClick={(e) => submitFunction(e)}
                    tabIndex={screenStatus === 'active' ? 0 : -1}
                >
                    Next
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                </button>
            </form>
        </div>
    )

}