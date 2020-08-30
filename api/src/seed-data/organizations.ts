import {plainToClass} from 'class-transformer';
import {Organization} from "../graphql-types/organization/organization-type";

export const sampleOrganization = [
    createOrganization({
        id: "1",
        name: "Prodyna"
    }),
    createOrganization({
        id: "2",
        name: "Microsoft",
    }),
    createOrganization({
        id: "3",
        name: "Levi9"
    }),
    createOrganization({
        id: "4",
        name: "TDI Radio"
    }),
    createOrganization({
        id: "5",
        name: "Gornjak Trade"
    })
];

function createOrganization(organizationData: Partial<Organization>): Organization {
    return plainToClass(Organization, organizationData);
}
