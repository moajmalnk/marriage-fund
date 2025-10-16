import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamStructure, getUserTotalContributed, hasUserPaidThisMonth } from '@/lib/mockData';
import { User, CheckCircle, XCircle, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Team = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;

  const teams = getTeamStructure();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Structure</h1>
        <p className="text-sm sm:text-base text-muted-foreground">View team hierarchy and payment progress</p>
      </div>

      <div className="space-y-4">
        {teams.map((team) => {
          const leaderContributed = getUserTotalContributed(team.responsible_member.id);
          const leaderExpected = team.responsible_member.assigned_monthly_amount * 12; // Assume 12 months for demo
          const leaderProgress = Math.min((leaderContributed / leaderExpected) * 100, 100);
          const leaderCompleted = leaderProgress >= 100;
          const leaderPaidThisMonth = hasUserPaidThisMonth(team.responsible_member.id);

          return (
            <Card key={team.responsible_member.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <span className="truncate">{team.responsible_member.name}</span>
                        {leaderCompleted && (
                          <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-primary shrink-0" />
                        )}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Responsible Member - {team.responsible_member.marital_status}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-xs sm:text-sm text-muted-foreground">Monthly Amount</p>
                    <p className="text-base sm:text-lg font-bold">
                      ₹{team.responsible_member.assigned_monthly_amount.toLocaleString('en-IN')}
                    </p>
                    {leaderPaidThisMonth ? (
                      <Badge className="bg-success text-success-foreground hover:bg-success/90 mt-1 text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="mt-1 text-xs">
                        <XCircle className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm mb-2 gap-1">
                    <span className="text-muted-foreground">Total Contribution Progress</span>
                    <span className="font-medium">
                      ₹{leaderContributed.toLocaleString('en-IN')} / ₹{leaderExpected.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Progress value={leaderProgress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 ml-3 sm:ml-6 border-l-2 border-border pl-3 sm:pl-6">
                  {team.members.map((member) => {
                    const memberContributed = getUserTotalContributed(member.id);
                    const memberExpected = member.assigned_monthly_amount * 12;
                    const memberProgress = Math.min((memberContributed / memberExpected) * 100, 100);
                    const memberCompleted = memberProgress >= 100;
                    const memberPaidThisMonth = hasUserPaidThisMonth(member.id);

                    return (
                      <div key={member.id} className="bg-muted/30 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium flex items-center gap-2 text-sm">
                                <span className="truncate">{member.name}</span>
                                {memberCompleted && (
                                  <Award className="h-4 w-4 text-primary fill-primary shrink-0" />
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{member.marital_status}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm font-medium">
                              ₹{member.assigned_monthly_amount.toLocaleString('en-IN')}
                            </p>
                            {memberPaidThisMonth ? (
                              <Badge className="bg-success text-success-foreground hover:bg-success/90 mt-1 text-xs">
                                <CheckCircle className="mr-1 h-2.5 w-2.5" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                <XCircle className="mr-1 h-2.5 w-2.5" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs mb-1 gap-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              ₹{memberContributed.toLocaleString('en-IN')} / ₹{memberExpected.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <Progress value={memberProgress} className="h-1.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
