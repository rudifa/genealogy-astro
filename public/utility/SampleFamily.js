const sampleFamily = {
    "persons": [
        {
            "name": "Chloé Rochat Favre",
            "info": "Née 1947"
        },
        {
            "name": "Jonas Schmid",
            "info": "1939-2007"
        },
        {
            "name": "Lina Keller Schmid",
            "info": "Née 1945"
        },
        {
            "name": "Lian Favre",
            "info": "Né 1942"
        },
        {
            "father": "Jonas Schmid",
            "mother": "Lina Keller Schmid",
            "name": "Mia Schmid Favre",
            "info": "Née 1983"
        },
        {
            "father": "Lian Favre",
            "mother": "Chloé Rochat Favre",
            "name": "Noah Favre",
            "info": "Né 1987"
        },
        {
            "father": "Noah Favre",
            "mother": "Mia Schmid Favre",
            "name": "Elena Favre",
            "info": "Née 2020"
        },
        {
            "father": "Noah Favre",
            "mother": "Mia Schmid Favre",
            "name": "Sofia Favre",
            "info": "Née 2017"
        },
        {
            "mother": "Chloé Rochat Favre",
            "name": "Matteo Rochat",
            "info": "Né 1969"
        }
    ]
}

export function getSampleFamily() {
    return sampleFamily;
}
export function getSampleFamilyAsJson() {
    return JSON.stringify(sampleFamily, null, 2);
}
