import {plainToClass} from 'class-transformer';
import {Organization} from "../graphql-types/organization/organization-type";
import faker from "faker";
export const sampleOrganization = [
    createOrganization({
        id: "1",
        name: faker.company.companyName()
    }),
    createOrganization({
        id: "2",
        name: faker.company.companyName(),
    }),
    createOrganization({
        id: "3",
        name: faker.company.companyName()
    }),
    createOrganization({
        id: "4",
        name: faker.company.companyName()
    }),
    createOrganization({
        id: "5",
        name: faker.company.companyName()
    })
];

function createOrganization(organizationData: Partial<Organization>): Organization {
    return plainToClass(Organization, organizationData);
}
