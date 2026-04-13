import { DefaultTemplate } from '../../components/templates/defaulttemplate';
import { Analytics as AnalyticsOrganism } from '../../components/organisms/analytics';
import { useRocketStats } from '../../hooks/userocketstats';

export const Analytics = () => {
    const { dashSummary } = useRocketStats('dashboard');

    return (
        <DefaultTemplate
            search=""
            onSearchChange={() => { }}
            categories={[]}
            selectedCategory=""
            onCategorySelect={() => { }}
        >
            <AnalyticsOrganism dashSummary={dashSummary} />
        </DefaultTemplate>
    );
};

export default Analytics;
